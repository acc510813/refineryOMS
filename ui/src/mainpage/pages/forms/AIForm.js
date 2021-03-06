/*************************************************************************
 * AIForm.js
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

import {Stage, Layer} from 'react-konva';

import SiteImage from '../SiteImage.js';
import {IMAGEHEIGHT, IMAGEWIDTH} from '../../../Parameters.js';

class AIForm extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  static get propTypes() {
      return {
          ai: PropTypes.object,
          aiTypes: PropTypes.any,
          histTypes: PropTypes.any,
          unitList: PropTypes.any,
          tagId: PropTypes.number,
          analogType: PropTypes.string,
          zeroValue: PropTypes.number,
          maxValue: PropTypes.number,
          unitId: PropTypes.number,
          histTypeCode: PropTypes.string,
          percent: PropTypes.number,
          hh: PropTypes.number,
          hi: PropTypes.number,
          lo: PropTypes.number,
          ll: PropTypes.number,
          tag: PropTypes.object,
          name: PropTypes.string,
          description: PropTypes.string,
          active: PropTypes.string,
          c1Lat: PropTypes.number,
          c1Long: PropTypes.number,
          c2Lat: PropTypes.number,
          c2Long: PropTypes.number,
          aiUpdate: PropTypes.func,
          fieldChange: PropTypes.func,
          handleQuit: PropTypes.func,
          handleMouseUp: PropTypes.func
      }
  }

  render() {
    let ai          = this.props.ai;
    let aitypes     = this.props.aiTypes;
    let histTypes   = this.props.histTypes;
    let unitList    = this.props.unitList;
//    let siteLoc     = this.props.siteLoc;
    const aiUpdate  = this.props.aiUpdate;
    const fieldChange = this.props.fieldChange;
    const handleQuit  = this.props.handleQuit;
    return(
      <div className="oms-tabs">
        <table>
          <tbody>
            <tr>
              <td className="oms-top">
        <form id="aiForm" >
          Please enter your analog input information
          <table>
            <tbody className="scrollContent-narrow">
              <tr>
                <th className="oms-spacing-90">&nbsp;</th>
                <td className="oms-spacing-180"><img src="images/spacer.png"
                    alt="" height="5px" width="180px"/></td>
              </tr>
              <tr>
                <th className="oms-spacing-90">AI name:</th>
                <td className="oms-spacing-180">
                  <input type="hidden" name="tagId" value={ai.tagId} />
                  <input type="text" id="tag.name" name="tag.name" value={ai.tag.name}
                         className={["oms-spacing-80","oms-fontsize-12"].join(' ')} size="10" maxLength="10"
                         onChange={fieldChange} />
                </td>
              </tr>
              <tr>
                <th className="oms-spacing-90">Description:</th>
                <td className="oms-spacing-180">
                  <input type="text" id="tag.description" name="tag.description" value={ai.tag.description}
                         className={["oms-spacing-180","oms-fontsize-12"].join(' ')} size="120" maxLength="120"
                         onChange={fieldChange} />
                </td>
              </tr>

              <tr>
                <td className="oms-spacing-90">Active:</td>
                <td className="oms-spacing-180">
                  <select id="tag.active" name="tag.active" value={ai.tag.active}
                          className={["oms-spacing-180","oms-fontsize-12"].join(' ')}
                          onChange={fieldChange} >
                    <option value="N">N</option>
                    <option value="Y">Y</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">Analog Type:</td>
                <td className="oms-spacing-180">
                  <select id="analogTypeCode" name="analogTypeCode" value={ai.analogTypeCode}
                          className={["oms-spacing-180","oms-fontsize-12"].join(' ')}
                          onChange={fieldChange} >
                    { aitypes.map(
                      function(n,x){
                        return <option key={x} value={n.code}>{n.name}</option>
                      } )
                    }
                  </select>
                </td>
              </tr>

          <tr>
            <td className="oms-spacing-90">Zero Value:</td>
            <td className={["oms-spacing-180","oms-fontsize-12"].join(' ')}>
              <input type="text" id="zeroValue" name="zeroValue" value={ai.zeroValue}
                      onChange={fieldChange} maxLength="8" size="10"/>
            </td>
          </tr>
          <tr>
            <td className="oms-spacing-90">Max Value:</td>
            <td className={["oms-spacing-180","oms-fontsize-12"].join(' ')}>
            <input type="text" id="maxValue" name="maxValue" value={ai.maxValue}
                    onChange={fieldChange} maxLength="9" size="10"/>
            </td>
          </tr>
          <tr>
            <td className="oms-spacing-90">Unit:</td>
            <td >
              <select id="unitId" name="unitId" value={ai.unitId}
                      onChange={fieldChange}>
                { unitList.map(
                  function(n,x){
                    return <option key={x} value={n.id}>{n.code} ({n.name})</option>
                  } )
                }
              </select>
            </td>
          </tr>
          <tr>
            <td className="oms-spacing-90">Hist Type:</td>
            <td >
              <select id="histTypeCode" name="histTypeCode" value={ai.histTypeCode}
                      onChange={fieldChange}>
                { histTypes.map(
                  function(n,x){
                    return <option key={x} value={n.code}>{n.name}</option>
                  } )
                }
              </select>
            </td>
          </tr>
          <tr>
            <td className="oms-spacing-90">Percent:</td>
            <td className={["oms-spacing-180","oms-fontsize-12"].join(' ')}>
              <input type="text" id="percent" name="percent" value={ai.percent}
                     onChange={fieldChange} maxLength="2" size="5"/>
            </td>
          </tr>

              <tr>
                <td className="oms-spacing-90">Alarm Limits:</td>
                <td className="oms-spacing-180">
                  HH: <input type="text" id="hh" name="hh" value={ai.hh} size="8"
                         className={["oms-spacing-80","oms-fontsize-12"].join(' ')}
                         onChange={fieldChange} />
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90">&nbsp;</td>
                <td className="oms-spacing-180">
                  HI: <input type="text" id="hi" name="hi" value={ai.hi} size="8"
                         className={["oms-spacing-80","oms-fontsize-12"].join(' ')}
                         onChange={fieldChange} />
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90"></td>
                <td className="oms-spacing-180">
                  LO: <input type="text" id="lo" name="lo" value={ai.lo} size="8"
                         className={["oms-spacing-80","oms-fontsize-12"].join(' ')}
                         onChange={fieldChange} />
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90"></td>
                <td className="oms-spacing-180">
                  LL: <input type="text" id="ll" name="ll" value={ai.ll} size="8"
                         className={["oms-spacing-80","oms-fontsize-12"].join(' ')}
                         onChange={fieldChange} />
                  </td>
              </tr>
              <tr>
                <th className="oms-spacing-90" >Corners (NW)</th>
                <td className="oms-spacing-180">
                  <input type="text" id="tag.c1Lat" name="tag.c1Lat" value={ai.tag.c1Lat}
                         className={["oms-spacing-60","oms-fontsize-12"].join(' ')}
                         onChange={fieldChange} maxLength="11" size="10" />
                  &nbsp;
                  <input type="text" id="tag.c1Long" name="tag.c1Long" value={ai.tag.c1Long}
                         className={["oms-spacing-60","oms-fontsize-12"].join(' ')}
                         onChange={fieldChange}  maxLength="11" size="10" />
                </td>
              </tr>
              <tr>
                <td className="oms-spacing-90" >&nbsp;&nbsp;&nbsp;(SE)</td>
                <td className={["oms-spacing-180","oms-fontsize-12"].join(' ')}>
                  <input type="text" id="tag.c2Lat" name="tag.c2Lat" value={ai.tag.c2Lat}
                         className={["oms-spacing-60","oms-fontsize-12"].join(' ')}
                         onChange={fieldChange} maxLength="11" size="10" />
                  &nbsp;
                  <input type="text" id="tag.c2Long" name="tag.c2Long" value={ai.tag.c2Long}
                         className={["oms-spacing-60","oms-fontsize-12"].join(' ')}
                         onChange={fieldChange}  maxLength="11" size="10" />
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
                         onClick={(e) => {handleQuit(e)}} />
                  &nbsp;<input type="submit" id="submitForm" name="submitForm"
                               value="Submit" className="oms-spacing"
                               onClick={(e) => {aiUpdate(e)}}/>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

              </td>
              <td>
                <Stage height={IMAGEHEIGHT} width={IMAGEWIDTH}>
                  <Layer>
                    <SiteImage handleMouseUp={this.props.handleMouseUp} />
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

export default AIForm;
