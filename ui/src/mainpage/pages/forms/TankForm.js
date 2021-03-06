/*************************************************************************
 * TankForm.js
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
/* eslint-env node, browser, es6 */

import React, {Component} from 'react';
import PropTypes          from 'prop-types';

import {IMAGEHEIGHT, IMAGEWIDTH} from '../../../Parameters.js';
import {Stage, Layer} from 'react-konva';

import SiteImage from '../SiteImage.js';
import Tank      from '../displays/Tank.js';


class TankForm extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  static get propTypes() {
      return {
          contentTypes: PropTypes.any,
          levels: PropTypes.array,
          siteLocation: PropTypes.object,
          tank: PropTypes.object,
          contentTypeCode: PropTypes.string,
          density: PropTypes.number,
          diameter: PropTypes.number,
          height: PropTypes.number,
          id: PropTypes.number,
          levelId: PropTypes.number,
          tag: PropTypes.object,
          active: PropTypes.string,
          c1Lat: PropTypes.number,
          c1Long: PropTypes.number,
          c2Lat: PropTypes.number,
          c2Long: PropTypes.number,
          description: PropTypes.string,
          name: PropTypes.string,
          tempId: PropTypes.number,
          units: PropTypes.string,
          temperatures: PropTypes.array,
          fieldChange: PropTypes.func,
          handleMouseUp: PropTypes.func,
          handleQuit: PropTypes.func,
          tankUpdate: PropTypes.func
      }
  }

  scaleX( tkLong, tLong, xScale ) {
    return Math.round(xScale * (tkLong - tLong));
  }

  scaleY( tkLat, tLat, yScale ) {
    return Math.round(yScale * (tkLat - tLat));
  }

  render() {
    const tk = this.props.tank;
    const ct = this.props.contentTypes;
    const tl = this.props.temperatures;
    const ll = this.props.levels;
    const site = this.props.siteLocation;
    const tag = tk.tag;
    var xDivisor = site.c2Long-site.c1Long;
    var xScale = IMAGEWIDTH / xDivisor;
    var yDivisor = site.c2Lat-site.c1Lat;
    var yScale = IMAGEHEIGHT / yDivisor;
    var style = "empty";

    var xnw = this.scaleX( tag.c1Long, site.c1Long, xScale);
    var wid = this.scaleX( tag.c2Long, site.c1Long, xScale) - xnw;
    var ynw = this.scaleY( tag.c1Lat,  site.c1Lat,  yScale);
    var ht  = this.scaleY( tag.c2Lat,  site.c1Lat,  yScale) - ynw;
    var tkHt = 0;
    var color = "red";

    const fc = this.props.fieldChange;
    const hq = this.props.handleQuit;
    const mu = this.props.handleMouseUp;
    const tu = this.props.tankUpdate;

    return(
      <div className="oms-tabs">
        <table>
          <tbody>
            <tr>
              <td className="oms-top">
        <form id="tankForm" >
          Please enter your tank information
          <table>
            <tbody className="scrollContent-narrow">
              <tr>
                <th className="oms-spacing-90">&nbsp;</th>
                <td className="oms-spacing"><img src="images/spacer.png"
                    alt="" height="5px" width="180px"/></td>
              </tr>
              <tr>
                <th className="oms-spacing-90">Field name:</th>
                <td className="oms-spacing">
                  <input type="hidden" name="id" value={tk.id} />
                  <input type="text" id="tag.name" name="tag.name" value={tk.tag.name}
                         className={["oms-spacing-80","oms-fontsize-12"].join(' ')} size="10" maxLength="10"
                         onChange={fc} />
                </td>
              </tr>
              <tr>
                <th className="oms-spacing-90">Description:</th>
                <td className="oms-spacing">
                  <input type="text" id="tag.description" name="tag.description" value={tk.tag.description}
                         className={["oms-spacing-240","oms-fontsize-12"].join(' ')} size="120" maxLength="120"
                         onChange={fc} />
                </td>
              </tr>

              <tr>
                <td className="oms-spacing-90">Active:</td>
                <td className="oms-spacing">
                  <select id="active" name="active" value={tk.tag.active}
                          onChange={fc} >
                    <option value="N">N</option>
                    <option value="Y">Y</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">Contents:</td>
                <td className="oms-spacing">
                  <select id="contentTypeCode" name="contentTypeCode" value={tk.contentTypeCode}
                          onChange={fc} >
                    { ct.map(
                      function(n,x){
                        return <option key={x} value={n.code}>{n.name}</option>
                      } )
                    }
                  </select>
                </td>
              </tr>
              <tr>
                <th className="oms-spacing-90">Corners (NW)</th>
                <td className="oms-spacing">
                  <input type="text" id="tag.c1Lat" name="tag.c1Lat" value={tk.tag.c1Lat}
                         className={["oms-spacing-90","oms-fontsize-12"].join(' ')}
                         onChange={fc} />
                  &nbsp;
                  <input type="text" id="tag.c1Long" name="tag.c1Long" value={tk.tag.c1Long}
                         className={["oms-spacing-90","oms-fontsize-12"].join(' ')}
                         onChange={fc} />
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">&nbsp;&nbsp;&nbsp;(SE)</td>
                <td>
                  <input type="text" id="tag.c2Lat" name="tag.c2Lat" value={tk.tag.c2Lat}
                         className={["oms-spacing-90","oms-fontsize-12"].join(' ')}
                         onChange={fc} />
                  &nbsp;
                  <input type="text" id="tag.c2Long" name="tag.c2Long" value={tk.tag.c2Long}
                         className={["oms-spacing-90","oms-fontsize-12"].join(' ')}
                         onChange={fc} />
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">Density:</td>
                <td className="oms-spacing">
                  <input type="text" id="density" name="density" value={tk.density} maxLength="10"
                         className={["oms-spacing-90","oms-fontsize-12"].join(' ')}
                         onChange={fc} />
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">Units:</td>
                <td className="oms-spacing-90">
                  <select id="units" name="units" value={tk.units}
                          onChange={fc}>
                    <option value="f">f</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">Height:</td>
                <td className="oms-spacing">
                  <input type="text" id="height" name="height" value={tk.height} size="8"
                         className={["oms-spacing-90","oms-fontsize-12"].join(' ')}
                         onChange={fc} />
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">Diameter:</td>
                <td className="oms-spacing">
                  <input type="text" id="diameter" name="diameter" value={tk.diameter} size="8"
                         className={["oms-spacing-90","oms-fontsize-12"].join(' ')}
                         onChange={fc} />
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">Level:</td>
                <td className="oms-spacing">
                  <select id="levelId" name="levelId" value={tk.levelId}
                          onChange={fc} >
                    { ll.map(
                      function(n,x){
                        return <option key={x} value={n.id}>{n.name}</option>
                      } )
                    }
                  </select>
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">Temperature:</td>
                <td className="oms-spacing">
                  <select id="tempId" name="tempId" value={tk.tempId}
                          onChange={fc} >
                    { tl.map(
                      function(n,x){
                        return <option key={x} value={n.id}>{n.name}</option>
                      } )
                    }
                  </select>
                  </td>
              </tr>

            </tbody>
          </table>
          <table className="oms-spacing">
            <tbody>
              <tr className="oms-spacing">
                <td>
                  <input type="submit" id="closeForm"  name="closeForm"
                         value="Quit" className="oms-spacing"
                         onClick={(e) => {hq(e)}} />
                  &nbsp;<input type="submit" id="submitForm" name="submitForm"
                               value="Submit" className="oms-spacing"
                               onClick={(e) => {tu(e)}}/>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

              </td>
              <td>
                <Stage height={IMAGEHEIGHT} width={IMAGEWIDTH}>
                  <Layer>
                    <SiteImage handleMouseUp={mu} />
                    <Tank xp = {xnw} yp = {ynw}
                          width = {wid}   height = {ht}
                          tankHeight = {tkHt}
                          tankType = {style} color={color} />
                  </Layer>
                </Stage>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }

}

export default TankForm;
