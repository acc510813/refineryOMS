/*******************************************************************************
 * Copyright (C) 2018 Laboratorio de Lobo Azul
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/
package us.avn.oms.scada;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.TimerTask;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import us.avn.oms.domain.AlarmType;
import us.avn.oms.domain.AnalogInput;
import us.avn.oms.domain.AnalogOutput;
import us.avn.oms.domain.CalcOperand;
import us.avn.oms.domain.CalcVariable;
import us.avn.oms.domain.ControlBlock;
import us.avn.oms.domain.DigitalInput;
import us.avn.oms.domain.DigitalOutput;
import us.avn.oms.domain.Watchdog;
import us.avn.oms.domain.RawData;
import us.avn.oms.service.AlarmService;
import us.avn.oms.service.AnalogInputService;
import us.avn.oms.service.AnalogOutputService;
import us.avn.oms.service.CalcVariableService;
import us.avn.oms.service.ControlBlockService;
import us.avn.oms.service.DigitalInputService;
import us.avn.oms.service.DigitalOutputService;
import us.avn.oms.service.HistoryService;
import us.avn.oms.service.WatchdogService;
import us.avn.oms.service.RawDataService;
import us.avn.rpn2.RPN2;

public class DataXfer extends TimerTask {
	
    /* Get actual class name to be printed on */
    private Logger log = LogManager.getLogger(this.getClass());
    private AnalogInputService ais = null;
    private AnalogOutputService aos = null;
    private AlarmService as = null;
    private ControlBlockService cbs = null;
    private CalcVariableService cvs = null;
    private DigitalInputService dis = null;
    private DigitalOutputService dos = null;
    private HistoryService hs = null;
    private WatchdogService wds = null;
    private RawDataService rds = null;

    private HashMap<String,AlarmType> almTypes = null;
 
	public void run( ) {
		log.debug("Start - HeapMemory: "+getCurrentlyUsedMemory()+", TotalMemory: "+getTotalMemory());
		log.debug("Start DataXfer processing");
		Calendar cal = Calendar.getInstance();
		if( cal.get(Calendar.HOUR) == 0 && cal.get(Calendar.MINUTE) == 0 ) {
			try {
				wait(10000);
			} catch( Exception e ) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				String eas = sw.toString();
				log.error(eas);
			}
		}

/*  */
		ApplicationContext context = new ClassPathXmlApplicationContext("app-context.xml");
		if( ais == null) { ais = (AnalogInputService) context.getBean("analogInputService"); }
		if( aos == null) { aos = (AnalogOutputService) context.getBean("analogOutputService"); }
		if( dis == null) { dis = (DigitalInputService) context.getBean("digitalInputService"); }
		if( dos == null) { dos = (DigitalOutputService) context.getBean("digitalOutputService"); }
		if( rds == null) { rds = (RawDataService) context.getBean("rawDataService"); }
		if( as  == null) { as = (AlarmService) context.getBean("alarmService"); }
		if( hs  == null) { hs = (HistoryService) context.getBean("historyService"); }
		if( wds == null) { wds = (WatchdogService) context.getBean("watchdogService"); }
		if( cvs == null) { cvs = (CalcVariableService) context.getBean("calcVariableService"); }
		if( cbs == null) { cbs = (ControlBlockService) context.getBean("controlBlockService"); }
		
		almTypes = getAlarmTypes(as);
		
		if( cal.get(Calendar.SECOND) == 0 ) {
			processAnalogInputs();
			log.debug("After AI - HeapMemory: "+getCurrentlyUsedMemory()+", TotalMemory: "+getTotalMemory());
		}
/*  */
		processDigitalInputs();
		log.debug("After DI - HeapMemory: "+getCurrentlyUsedMemory()+", TotalMemory: "+getTotalMemory());
		
		processCalculatedVariables();
		log.debug("After CV - HeapMemory: "+getCurrentlyUsedMemory()+", TotalMemory: "+getTotalMemory());
		
		processControlBlocks();
		log.debug("After CB - HeapMemory: "+getCurrentlyUsedMemory()+", TotalMemory: "+getTotalMemory());
		
		processAnalogOutputs();
		log.debug("After AO - HeapMemory: "+getCurrentlyUsedMemory()+", TotalMemory: "+getTotalMemory());
		
		processDigitalOutputs();
		log.debug("After DO - HeapMemory: "+getCurrentlyUsedMemory()+", TotalMemory: "+getTotalMemory());

		log.debug("End process variable processing");
		log.debug("End - HeapMemory: "+getCurrentlyUsedMemory()+", TotalMemory: "+getTotalMemory());
		return;
	}
	
	private long getCurrentlyUsedMemory() {
		return	ManagementFactory.getMemoryMXBean().getHeapMemoryUsage().getUsed() +
				ManagementFactory.getMemoryMXBean().getNonHeapMemoryUsage().getUsed();
	}
	
	private long getTotalMemory() {
		return  ManagementFactory.getMemoryMXBean().getHeapMemoryUsage().getCommitted() +
				ManagementFactory.getMemoryMXBean().getNonHeapMemoryUsage().getCommitted();
	}
	
	private void processAnalogInputs() {
		wds.updateWatchdog(Watchdog.AI);
//		Update the analog inputs (check the raw data table, get and process the values)
		Iterator<AnalogInput> iai = ais.getAllUpdatedAItags().iterator();
		while( iai.hasNext() ) {
			AnalogInput ai = iai.next();
			log.debug("AnalogInput: "+ai.toString());
			log.debug("Processing AI tag "+ai.getTag().getName() + "/" + ai.getTagId());
			processAIValue( ai, ai.getSimValue(), ai.getSimScanTime());
			rds.clearUpdated(ai.getTagId());
		}
		log.debug("Completed processing analog inputs");
	}
	
	private void processDigitalInputs() {
		wds.updateWatchdog(Watchdog.DI);

		Collection<DigitalInput> cdi = dis.getAllUpdatedDItags();
		Iterator<DigitalInput> idi = cdi.iterator();
		while( idi.hasNext() ) {
			DigitalInput di = idi.next();
			log.debug("Processing DI tag "+di.toString());
			if( 0 != di.getUpdated() ) {
				Instant now = Instant.now();
				Double result = new Double(di.getSimValue());
				processDIValue(di, result, now );
			}
			rds.clearUpdated(di.getTagId());
		}
	}
	
	private void processCalculatedVariables() {
		wds.updateWatchdog(Watchdog.CV);
//		Now update all the calculated variables
		RPN2 evaluator = new RPN2();
		Iterator<CalcVariable> icv = cvs.getAllCalcVariables().iterator();
		while ( icv.hasNext() ) {
			CalcVariable cv = icv.next();
			log.debug("Processing CV "+cv.getTag().getName()+"/"+cv.getId()
			         +" as "+cv.getDefinition());
			Iterator<CalcOperand> ico = cvs.getValuesForCalculation(cv.getId()).iterator();
			Double[] cvin = new Double[10];
			int coi = 0;
			while( ico.hasNext() ) {
				CalcOperand co = ico.next();
				cvin[coi] = co.getScanValue();
				coi++;
			}
			log.debug("CV: "+cv.getTag()+" Defn: "+cv.getDefinition()+" using input "+cvin[0]);
			Double result = evaluator.evaluate(cv.getDefinition(), cvin );
			log.debug("CV: "+cv.getTag() + " yields "+result);
			Instant now = Instant.now();
			AnalogInput ai = ais.getAnalogInput(cv.getOutputTagId());
			if( null != ai ) {
				AnalogInput aix = new AnalogInput(ai);
				processAIValue( aix, result, now );
			} else {
				DigitalInput di = dis.getDigitalInput(cv.getOutputTagId());
				processDIValue( di, result, now );
			}
		}
		log.debug("Completed processing calculated variables");
	}
	
	/**
	 * Retrieves all the control blocks for which the PV != SP
	 */
	private void processControlBlocks() {
		wds.updateWatchdog(Watchdog.CB);
		Iterator<ControlBlock> icb = cbs.getAllAOs().iterator();
		while( icb.hasNext() ) {
			ControlBlock cb = icb.next();
			log.debug("Processing ControlBlock: "+cb.toString());
			AnalogOutput co = aos.getAnalogOutput(cb.getId());
			AnalogInput sp = ais.getAnalogInput(cb.getSpId());
			co.setPrevValue(co.getScanValue());
			co.setPrevTime(co.getScanTime());
			// not sure the following is right.  I was thinking to scale the output based on the
			// proportion of the setpoint scale, ie, if the setpoint is 50% of the setpoint range,
			// set the output to 50% of its range.  Does that make sense to you?
			Double prop = (cb.getSetpoint()-sp.getZeroValue())/(sp.getMaxValue()-sp.getZeroValue());
			Double cov = prop * (co.getMaxValue()-co.getZeroValue());
			co.setScanValue(cov);
			aos.updateAOvalue(co);
		}
		log.debug("Completed processing control blocks");
	}
	
	private void processAnalogOutputs() {
		wds.updateWatchdog(Watchdog.AO);
		Iterator<AnalogOutput> iao = aos.getAnalogOutputsToUpdate().iterator();
		while( iao.hasNext()) {
			AnalogOutput ao = iao.next();
			log.debug("Processing AnalogOutput: "+ao.toString());
			RawData x = new RawData(ao.getTagId(), ao.getScanValue() );
			rds.updateRawData(x);
			aos.clearAOupdate(ao.getTagId());
		}
		log.debug("Completed processing analog outputs");
	}
	
	private void processDigitalOutputs() {
		wds.updateWatchdog(Watchdog.DO);
		Iterator<DigitalOutput> ido = dos.getDigitalOutputsToUpdate().iterator();
		while( ido.hasNext()) {
			DigitalOutput d = ido.next();
			log.debug("Processing DigitalOutput: "+d.toString());
			RawData x = new RawData(d.getTagId(), d.getScanValue() );
			rds.updateRawData(x);
			dos.clearDOupdate(d.getTagId());
		}
		log.debug("Completed processing digital outputs");
	}
	
	/**
	 * Provide any needed corrections for the raw scan value
	 * based on the analog type.  Currently the only modification is 
	 * for Accumulator analogs which increase the value based on the 
	 * amount for the current rain event.  NB, this may only be applicable
	 * for AcuRite rain values.
	 * @param ai Analog Input to process
	 * @param scanValue current scan value
	 * @return newScanValue  new scan value
	 */
	private Double correctScanValue( AnalogInput ai, Double scanValue ) {
		Double newScanValue = scanValue;
		if( "A".equals(ai.getAnalogTypeCode()) ) {
			Double rawValue = ai.getRawValue();
			newScanValue = ai.getScanValue();
			if( scanValue != 0D ) {
				if( scanValue > rawValue ) {
					newScanValue += (scanValue-rawValue);
				}
			}
		}
		return newScanValue;
	}
	
	/**
	 * Process analog input value.  This entails some scan value correction,
	 * setting raw and previous values, checking for alarms, determining if
	 * a history value needs to be written, and updating the DB record for the
	 * AI.
	 * @param ai analog input to modify
	 * @param scanValue updated value 
	 * @param scanTime time of updated value
	 */
	private void processAIValue( AnalogInput ai, Double scanValue, Instant scanTime ) {
		try {
			Double newScanValue = correctScanValue( ai, scanValue );
			ai.setRawValue(scanValue);
			ai.setPrevValue(ai.getScanValue());
			ai.setPrevTime(ai.getScanTime());
			ai.setScanValue(newScanValue);
			ai.setScanTime(scanTime);
			ai.checkForAlarm(as, almTypes);
			ai.updateHistory(hs);
			ais.updateAnalogInput(ai);
		} catch( Exception e ) {
			StringWriter sw = new StringWriter();
			log.error("processAIvalue:"+ai.toString());
			StackTraceElement[] st = e.getStackTrace();
			e.printStackTrace(new PrintWriter(sw));
			for( int i=0; i<Math.max(st.length,5); i++ ) {
				log.error(st[i].toString());				
			}
		}
	}

	/**
	 * Method: processDIValue 
	 * Description: 
	 * @param di digital input to modify
	 * @param scanValue updated value
	 * @param scanTime time of updated value
	 */
	private void processDIValue( DigitalInput di, Double scanValue, Instant scanTime ) {
		di.setPrevValue(di.getScanValue());
		di.setPrevScanTime(di.getScanTime());
		di.setScanValue(scanValue);
		di.setScanTime(scanTime);
		dis.updateDigitalInput(di);
	}
	
	private HashMap<String,AlarmType> getAlarmTypes( AlarmService as ) {
		HashMap<String,AlarmType> tat = new HashMap<String,AlarmType>();
		Iterator<AlarmType> iat = as.getAlarmTypes().iterator();
		while( iat.hasNext() ) {
			AlarmType c = iat.next();
			tat.put(c.getCode(), c);
		}
		return tat;
	}
	
}
