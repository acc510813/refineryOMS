/*************************************************************************
 * SiteImage.js
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


import {Image}            from 'react-konva';
import {IMAGEHEIGHT, IMAGEWIDTH} from '../../Parameters.js';


class SiteImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
       img:null,
       onMouseUp: props.handleMouseUp
     }
  }

  static get propTypes() {
      return {
          handleMouseUp: PropTypes.func
      }
  }

  componentDidMount() {
    const img = new window.Image();
    img.src = "../../images/delcity.png";
    img.onload = () => { this.setState( {img:img} ); }
  }

  render () {
    return <Image image={this.state.img}
                  height={IMAGEHEIGHT}
                  width={IMAGEWIDTH}
                  onMouseUp={this.state.onMouseUp} />
  }
}

export default SiteImage;