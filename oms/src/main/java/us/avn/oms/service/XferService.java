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
 *****************************************************************************/
package us.avn.oms.service;

import us.avn.oms.domain.Xfer;

/**
 * Interface:  XferService
 * Description: Specify the methods for DB access to the XFER (transfer) table
 *
 * @author Allan
 *
 */
public interface XferService {

	/**
	 * Method: clearUpdated
	 * Description: clear the updated flag in the given XFER record
	 *
	 * @param id - Long - ID for the specified XFER record
	 */
	void clearUpdated( Long id );

	/**
	 * Method: updateXfer
	 * Description: update the XFER w/the specified object values
	 *
	 * @param x Xfer object to update
	 */
	void updateXfer( Xfer x );

}
