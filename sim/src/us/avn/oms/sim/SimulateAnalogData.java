package us.avn.oms.sim;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.TimerTask;
import java.util.Vector;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.protocol.HTTP;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import us.avn.oms.domain.Alarm;
import us.avn.oms.domain.AlarmType;
import us.avn.oms.domain.AnalogInput;
import us.avn.oms.domain.Config;
import us.avn.oms.domain.Tag;
import us.avn.oms.domain.Tank;
import us.avn.oms.domain.Transfer;
import us.avn.oms.domain.Volume;
import us.avn.oms.domain.Watchdog;
import us.avn.oms.domain.Xfer;
import us.avn.oms.service.AlarmService;
import us.avn.oms.service.AnalogInputService;
import us.avn.oms.service.ConfigService;
import us.avn.oms.service.ControlBlockService;
import us.avn.oms.service.TagService;
import us.avn.oms.service.TankService;
import us.avn.oms.service.TransferService;
import us.avn.oms.service.WatchdogService;
import us.avn.oms.service.XferService;

public class SimulateAnalogData extends TimerTask {
	
    /* Get actual class name to be printed on */
    private Logger log = LogManager.getLogger(this.getClass());

    private ApplicationContext context = null;
    private AnalogInputService ais = null;
    private ControlBlockService cbs = null;
    private ConfigService cs = null;
    private TagService tgs = null;
    private TankService tks = null;
    private TransferService tfs = null;
    private WatchdogService wds = null;
    private XferService xs = null;
     
	public void run( ) {

/*  */
		if( context == null) { context = new ClassPathXmlApplicationContext("app-context.xml"); }
		if( ais == null ) { ais = (AnalogInputService) context.getBean("analogInputService"); }
		if( cbs == null ) { cbs = (ControlBlockService) context.getBean("controlBlockService"); }
		if( cs  == null ) { cs = (ConfigService) context.getBean("configService"); }
		if( tgs == null ) { tgs = (TagService) context.getBean("tagService"); }
		if( tks == null ) { tks = (TankService) context.getBean("tankService"); }
		if( tfs == null ) { tfs = (TransferService) context.getBean("transferService"); }
		if( xs  == null ) { xs = (XferService) context.getBean("xferService"); }
		if( wds == null ) { wds = (WatchdogService) context.getBean("watchdogService"); }
		
//		process the outputs
		SimulateAOData.execute(cbs, wds, xs);
//		process the inputs
		SimulateAIData.execute(ais, cs, tgs, tks, tfs, wds, xs);
	}
	
}