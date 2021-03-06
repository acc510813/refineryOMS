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
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;


/**
 * Used to transfer process data between the devices and the OMS
 */
public class RawData extends OMSObject implements Serializable {

	
	private Long     id;
	private Integer  updated;
	private Double   floatValue;
	private Instant  scanTime;
	
	public RawData()  {}
	
	public RawData( Long id, Double fv ) {
		this.id = id;
		this.floatValue = fv;
		this.updated = 1;
		this.scanTime = Instant.now();
	}
	
	
	public Long getId() {
		return id;
	}

	public void setId(Long i) {
		this.id = i;
	}


	public Integer getUpdated() {
		return updated;
	}

	public void setUpdated(Integer upd ) {
		this.updated = upd;
	}


	public Double getFloatValue() {
		return floatValue;
	}

	public void setFloatValue(Double fv ) {
		this.floatValue = fv;
	}


	public Instant getScanTime() {
		return scanTime;
	}

	public void setScanTime(Instant zdt ) {
		this.scanTime = zdt;
	}


}
