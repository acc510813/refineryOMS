package us.avn.oms.service;

import java.util.Collection;

import us.avn.oms.domain.AIValue;
import us.avn.oms.domain.AnalogInput;
import us.avn.oms.domain.IdName;
import us.avn.oms.domain.ReferenceCode;


public interface AnalogInputService {
	
	public Collection<AnalogInput> getAllAnalogInputs( );
	
	public Collection<AnalogInput> getAllActiveAItags( );

	public Collection<AnalogInput> getAllUpdatedAItags( );

	public Collection<AnalogInput> getAllAnalogInputsByType( String tc );
	
	public Collection<IdName> getAllAIIdNameByType( String tc );
	
	public AnalogInput getBaseAnalogInput( Long id);
	
	public AnalogInput getAnalogInput( Long id);
	
	public Collection<AIValue> getCurrentAIValues();
	
	public Collection<ReferenceCode> getAllAnalogInputTypes();
	
	public Collection<ReferenceCode> getAllHistoryTypes();
	
	public void updateAnalogInput( AnalogInput ai );

	public void updateAnalogInputStatic( AnalogInput ai );

	public Long insertAnalogInput( AnalogInput ai );

	public Collection<AIValue> getProcUnitValues( String un);

}