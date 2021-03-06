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
package us.avn.oms.rest.controller;

import java.util.Collection;
import java.util.Iterator;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

//import us.avn.oms.domain.Tag;
import us.avn.oms.domain.Carrier;
import us.avn.oms.domain.Hold;
import us.avn.oms.service.CustomerService;
import us.avn.oms.service.TagService;
import us.avn.oms.service.CarrierService;

@RestController

@RequestMapping("/carrier")
public class CarrierRestController {
	
    /* Get actual class name to be printed on */
    private Logger log = LogManager.getLogger(this.getClass().getName());

	@Autowired 
	CustomerService customerService;

	@Autowired 
	TagService tagService;

	@Autowired 
	CarrierService carrierService;

	@RequestMapping(method = RequestMethod.GET, produces="application/json", value="/all")
	public Collection<Carrier> getAllCarriers( ) {
		log.debug("get all carriers");
		return carrierService.getAllCarriers();
	}
	
	@RequestMapping(method = RequestMethod.GET, produces="application/json", value="/{id}")
	public Carrier getCarrier( @PathVariable Long id) {
		Carrier c = null;
		if( 0L == id ) {
			c = new Carrier();
			c.setId(id);
			c.setName("New carrier"+id);
		} else {
			c = carrierService.getCarrier(id);
			c.setHolds(carrierService.getHolds(id));
		}
		return c;
	}
	
	@RequestMapping(method = RequestMethod.PUT, value="/update" )
	public void updateCarrier(@RequestBody Carrier c ) {
		log.debug("Update " + c.toString()); 
		Long id = c.getId();
		if( c.getId() == 0L ) {
			c.setId(id);
			carrierService.insertCarrier(c);
		} else {
			carrierService.updateCarrier(c);
		}
		updateHolds(c);
	}

	@RequestMapping(method = RequestMethod.POST, value="/insert" )
	public Long insertcarrier(@RequestBody Carrier c ) {
		log.debug("Insert " + c.toString());
		Long id = c.getId();
		if( id == 0L ) {
			carrierService.insertCarrier(c);
		} else {
			carrierService.updateCarrier(c);
		}
		updateHolds(c);
		return id;
	}

	private void updateHolds(Carrier c) {
		Iterator<Hold> ih = c.getHolds().iterator();
		while( ih.hasNext() ) {
			Hold h = ih.next();
			carrierService.insertHold(h);
		}
	}
}
