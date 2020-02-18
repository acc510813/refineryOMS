/*************************************************************************
 * oms.js
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ClassificationMenu extends Component {
  constructor(props) {
    super(props);
    this.stage={};
  }

  static get propTypes() {
      return {
          classifications: PropTypes.any,
          selected: PropTypes.any,
          handleCatSelect: PropTypes.func
      }
  }

  render() {
    var classList = this.props.classifications;
    var selected = this.props.selected;
    var catSelected = this.props.handleCatSelect;
    var lineStyle = { margin:0, border:0, height:3 };
    return (
      <div className="oms-tabs">
        <nav>
          <ul className="oms-tabs-nav">
            {classList.map(
              function(n,x){
                let t=n.text.replace(" ","");
                if( selected.localeCompare(t) !== 0 ) {
                  return <li key={x}>
                           <button type="button" className="cat-button" onClick={() => {catSelected({t})}} >
                             {n.text}
                           </button>
                         </li>
                }
                return <li key={x}>
                         <button type="button" className="cat-button-selected" onClick={() => {catSelected({t})}} >
                           {n.text}
                         </button>
                       </li>;
                }
              )
            }
          </ul>
        </nav>
        <hr color="white" size="3 px" width="1000 px" align="left" style={lineStyle} />
      </div>
    )
  }
}

export default ClassificationMenu;
