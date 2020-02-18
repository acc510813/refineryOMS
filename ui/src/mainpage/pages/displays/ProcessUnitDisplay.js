/*************************************************************************
 * ProcessUnitDisplay.js
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

import {AIValue}  from '../objects/AIValue.js';
import {IL3}      from '../objects/ListObjects.js';



class ProcessUnitDisplay extends Component {
  constructor( props ) {
    super(props);
    this.state = {
      stage: props.stage,
      option: props.option,
      updateData: false,
      updateDisplay: true,
      items: props.items,
      itemSelect: props.itemSelect
    };
  }

  static get propTypes() {
      return {
          stage: PropTypes.string,
          option: PropTypes.string,
          items: PropTypes.array,
          itemSelect: PropTypes.func
      }
  }

  static getDerivedStateFromProps(nextProps, state) {
    return state;
//    this.setState({ option: nextProps.option,
//                    items: nextProps.items,
//                    itemSelect: nextProps.itemSelect });
  }

  render () {
    let itemSelect = this.state.itemSelect;
    let it = this.state.items;
    let puColumns = [];
    it.forEach((i,x) => {
      if( !((x+1) % 3) ) {
        let it0 = it[x-2];
        let it1 = it[x-1];
        let it2 = it[x];
        let AIV0 = new AIValue(it0.tagId,it0.name,it0.value,it0.valueText,it0.scanTime,it0.alarmCode,it0.alarmColor);
        let AIV1 = new AIValue(it1.tagId,it1.name,it1.value,it1.valueText,it1.scanTime,it1.alarmCode,it1.alarmColor);
        let AIV2 = new AIValue(it2.tagId,it2.name,it2.value,it2.valueText,it2.scanTime,it2.alarmCode,it2.alarmColor);
        let il = new IL3(AIV0,AIV1,AIV2);
        puColumns.push(il);
      }
    });
    const dl = it.length;
    const rem = dl%3;
    if( rem > 0 ) {
      let AIV2 = new AIValue(0,"",null,"",null,"NORM","green");
      let AIV1 = new AIValue(0,"",null,"",null,"NORM","green");
      let AIV0 = new AIValue(0,"",null,"",null,"NORM","green");
      let x = dl-rem;
      if( rem > 1 ) {
        let it1 = it[x+1];
        AIV1 = new AIValue(it1.tagId,it1.name,it1.value,it1.valueText,it1.scanTime,it1.alarmCode,it1.alarmColor);
      }
      let it0  = it[x];
      AIV0 = new AIValue(it0.tagId,it0.name,it0.value,it0.valueText,it0.scanTime,it0.alarmCode,it0.alarmColor);
      let il = new IL3(AIV0,AIV1,AIV2);
      puColumns.push(il);
    }

    var n = new Date();
    var now = n.toLocaleString('en-US');
    return(
      <div>
      <h2>
        <div className={"oms-tags"}>
           <img src="./images/spacer.png" alt="" height="1px" width="100px"/>
           Process Unit {this.state.option} - {now}
        </div>
      </h2>
      <table className={"scrollTable"}>
        <thead className={"fixedHeader"}>
          <tr>
            <td className={"oms-spacing-120"}>
              <img src="./images/spacer.png" alt="" height="1px" width="5px"/>
              Tag
            </td>
            <td className={"oms-spacing-90"}>
              <img src="./images/spacer.png" alt="" height="1px" width="5px"/>
              Value
            </td>
            <td className={"oms-spacing-120"}>
              <img src="./images/spacer.png" alt="" height="1px" width="5px"/>
              Tag
            </td>
            <td className={"oms-spacing-90"}>
              <img src="./images/spacer.png" alt="" height="1px" width="5px"/>
              Value
            </td>
            <td className={"oms-spacing-120"}>
              <img src="./images/spacer.png" alt="" height="1px" width="5px"/>
              Tag
            </td>
            <td className={"oms-spacing-90"}>
              <img src="./images/spacer.png" alt="" height="1px" width="5px"/>
              Value
            </td>
          </tr>
        </thead>
        <tbody className={"scrollContent"}>
          {puColumns.map(
            function(n,x) {
              let ztc = "#C3C2B9";
              let zx1 = n.i1;
              const z1 = zx1.id;
              let zx1c = zx1.color;
              let zx2 = n.i2;
              const z2 = zx2.id;
              let zx2c = zx2.color;
              let zx3 = n.i3;
              const z3 = zx3.id;
              let zx3c = zx3.color;
              return (
                <tr key={x}>
                  <td className={"oms-spacing-120"}>
                    <button type="button" className="link-button"
                            onClick={() => {itemSelect({z1})}} >
                      <div style={{"color":ztc}}>{zx1.name}</div>
                    </button>
                  </td>
                  <td className={"oms-spacing-90"}>
                    <div style={{"color":zx1c}}>{zx1.valueText}</div>
                  </td>
                  <td className={"oms-spacing-120"}>
                    <button type="button" className="link-button"
                            onClick={() => {itemSelect({z2})}} >
                      <div style={{"color":ztc}}>{zx2.name}</div>
                    </button>
                  </td>
                  <td className={"oms-spacing-90"}>
                    <div style={{"color":zx2c}}>{zx2.valueText}</div>
                  </td>
                  <td className={"oms-spacing-120"}>
                    <button type="button" className="link-button"
                            onClick={() => {itemSelect({z3})}} >
                      <div style={{"color":ztc}}>{zx3.name}</div>
                    </button>
                  </td>
                  <td className={"oms-spacing-90"}>
                      <div style={{"color":zx3c}}>{zx3.valueText}</div>

                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      </div>

      );
  }
}

export default ProcessUnitDisplay;