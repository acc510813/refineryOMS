/*************************************************************************
 * Transfer.js
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
import   moment   from 'moment';

export function Transfer(i,n,sid,s,ttid,tt,srcid,src,destid,dest,est,eet,ev,ast,aet,av,d) {
  let fmt = "YYYY-MM-DD HH:mm:ss";
  this.id=i; this.name=n;
  this.statusId=(sid!=null?sid:0); this.status=s;
  this.transferTypeId=(ttid!==null?ttid:-1); this.transferType=tt;
  this.sourceId=(srcid!==null?srcid:-1); this.source=src;
  this.destinationId=(destid!==0?destid:0); this.destination=dest;
  this.expStartTime=(est===null)?"":moment.utc(est*1).local().format(fmt);
  this.expEndTime=(eet===null)?"":moment.utc(eet*1).local().format(fmt);
  this.expVolume=ev; this.delta=d;
  this.actStartTime=(ast===null)?"":moment.utc(ast*1).local().format(fmt);
  this.actEndTime=(aet===null)?"":moment.utc(aet*1).local().format(fmt);
  this.actVolume=av;
}

