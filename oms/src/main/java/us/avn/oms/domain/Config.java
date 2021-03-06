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
package us.avn.oms.domain;

import java.io.Serializable;


public class Config extends OMSObject implements Serializable {
	
	public static final String ASPHALT_PERCENT = "ASPHALT-PERCENT";
	public static final String COKE_PERCENT = "COKE_PERCENT";
	public static final String CURRENT_PRESSURE = "CURRENT_PRESSURE";
	public static final String CURRENT_TEMP = "CURRENT_TEMP";
	public static final String CURRENT_WIND_DIR = "CURRENT_WIND_DIR";
	public static final String CURRENT_WIND_SPEED = "CURRENT_WIND_SPEED";
	public static final String DOCK1 = "Dock1";
	public static final String DOCK2 = "Dock2";
	public static final String DOCK3 = "Dock3";
	public static final String DOCK4 = "Dock4";
	public static final String EMAIL_FROM = "EMAIL_FROM";
	public static final String EMAIL_PWD = "EMAIL_PWD";
	public static final String EMAIL_USER = "EMAIL_USER";
	public static final String FUEL_OIL_PERCENT = "FUEL-OIL-PERCENT";
	public static final String GASOLINE_PERCENT = "GASOLINE-PERCENT";
	public static final String HHCOLOR = "HHCOLOR";
	public static final String HICOLOR = "HICOLOR";
	public static final String JET_FUEL_PERCENT = "JET-FUEL-PERCENT";
	public static final String LAST_HOUR_PRECIP = "LAST_HOUR_PRECIP";
	public static final String LLCOLOR = "LLCOLOR";
	public static final String LOCOLOR = "LOCOLOR";
	public static final String LOGGER_LEVEL = "LOGGER_LEVEL";
	public static final String LUBRICANTS_PERCENT = "LUBRICANTS-PERCENT";
	public static final String NAME_PATTERN_PIPE = "NAME-PATTERN-PIPE";
	public static final String NAME_PATTERN_PUMP = "NAME-PATTERN-PUMP";
	public static final String NAPTHA_PERCENT = "NAPTHA-PERCENT";
	public static final String NORMCOLOR = "NORMCOLOR";
	public static final String NUMBER_DOCKS = "NUMBER-DOCKS";
	public static final String NUMBER_TANKCARS = "NUMBER-TANKCARS";
	public static final String NUMBER_TANKTRUCKS = "NUMBER-TANKTRUCKS";
	public static final String REFINERY_UNIT_1 = "REFINERY-UNIT-1";
	public static final String REFINERY_UNIT_2 = "REFINERY-UNIT-2";
	public static final String SHIP_PRESENT_NAME = "SHIP-PRESENT-NAME";
	public static final String SITE = "SITE";
	public static final String SMTP_HOST = "SMTP_HOST";
	public static final String SMTP_PORT = "SMTP_PORT";
	public static final String STATION_NAME_MASK = "STATION_NAME_MASK";
	public static final String STILLGAS_PERCENT = "STILLGAS-PERCENT";
	public static final String TANKCAR_PRESENT_NAME = "TANKCAR-PRESENT-NAME";
	public static final String TANKTRUCK_PRESENT_NAME = "TANKTRUCK-PRESENT-NAME";
	public static final String TRAIN_PRESENT_NAME = "TRAIN-PRESENT-NAME";
	public static final String TRUCK_DOCK_1_NAME = "TrkDk1";
	public static final String TRUCK_DOCK_2_NAME = "TrkDk2";
	public static final String TRAIN_DOCK_NAME = "TrnDk";
	public static final String UI_LOG_DIRECTORY = "UI_LOG_DIRECTORY";
	public static final String WATCHDOG_EMAIL = "WATCHDOG_EMAIL";
	public static final String WAXES_PERCENT = "WAXES-PERCENT";
	public static final String WEATHER_DELAY = "WEATHER_DELAY";
	public static final String WEATHER_INTERVAL = "WEATHER_INTERVAL";
	public static final String WEATHER_LOCATION = "WEATHER_LOCATION";
	public static final String WEATHER_TYPE = "WEATHER_TYPE";

	private static final long serialVersionUID = 8751282105532159742L;
	
	private Long id;
	private String key;
	private String value;
	  
	
	public Long getId() {
		return this.id;
	}
	
	public void setId( Long i ) {
		this.id = i;
	}
	

	public String getKey() {
		return key;
	}
	
	public void setKey(String kn) {
		this.key = kn;
	}
	
	
	public String getValue() {
		return value;
	}
	
	public void setValue(String kv) {
		this.value = kv;
	}

}
