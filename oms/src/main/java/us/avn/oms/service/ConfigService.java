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
package us.avn.oms.service;

import java.util.Collection;
import java.util.HashMap;

import us.avn.oms.domain.Config;
import us.avn.oms.domain.Tag;


public interface ConfigService {
	
	public Collection<Config> getAllConfigurationItems( );
	
	public HashMap<String, String> getAllConfigItems();
	
	public Collection<String> getOmsViews();
	
	public Config getConfigurationItem( String key);
	
	public Tag getSiteLocation();
	
	void updateConfigurationItem( Config cfg );

	void insertConfigurationItem( Config cfg );

}
