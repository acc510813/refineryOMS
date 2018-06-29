package us.avn.oms.mapper;

import java.util.Collection;

import us.avn.oms.domain.AIValue;
import us.avn.oms.domain.Field;

public interface FieldMapper {
	
	Collection<Field> getAllFields( );
	
	Field getFieldByName( String fn );
	
	Field getFieldDefinition( Long id );
	
	Field getFieldForDisplay( Long id );
	
	Collection<AIValue> getFieldObjects( String f );
	
	Long insertField( Field f );
	
	void updateField( Field f );

}