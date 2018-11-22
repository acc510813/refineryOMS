/*************************************************************************
 * ListObjects.js
 * Copyright (C) 2018  Laboratorio de Lobo Azul
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
 ***********************************************************************/

/**
 * CE  is a simple version of an identifier (a "Column Entry")
 * IL3 allows us to associate 3 of anything, but mostly just the CEs, to
 *     make a 3 column display
 */
export function CE(i,n) {this.id=i; this.name=n; }

export function IL3(i1,i2,i3) {this.i1=i1; this.i2=i2; this.i3=i3;}
