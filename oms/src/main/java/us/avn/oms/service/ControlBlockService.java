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

import us.avn.oms.domain.ControlBlock;


public interface ControlBlockService {
	
	public Collection<ControlBlock> getAllAOs( );
	
	public Collection<ControlBlock> getAllCBs( );

	public Collection<ControlBlock> getAllDOs( );

	public ControlBlock getControlBlock( Long id );
	
	public void insertControlBlock( ControlBlock cb );
	
	public void updateControlBlock( ControlBlock cb );

}
