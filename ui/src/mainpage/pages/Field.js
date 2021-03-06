/*************************************************************************
 * Field.js
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

import {SERVERROOT}    from '../../Parameters.js';
import DefaultContents from './DefaultContents.js';
import Log             from '../requests/Log.js';
import Waiting         from './Waiting.js';
import FieldDisplay    from './displays/FieldDisplay.js';


/*
 * select f.id, f.satellite_image image, c1_lat, c1_long, c2_lat, c2_long
	 from field f join tag t on f.id = t.id
	where t.name='DeCity';

	select field_tag_id, child_tag_id from field_tag_vw ftv, tank tk
	 where ftv.child_tag_id=tk.id and ftv.field_tag_id= 1;
 */

class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: props.stage,
      img: props.img,
      updateData: false,
      updateDisplay: true,
      fieldName: props.fieldName,
      tankType: props.tankType,
      field: null,
      tags: null,
      siteLoc: null,
      returnedText: null,
      unitTimer: null,
      itemTimer: null
    };
  }

  static get propTypes() {
      return {
          stage: PropTypes.string,
          fieldName: PropTypes.string,
          field: PropTypes.any,
          img: PropTypes.any,
          tankType: PropTypes.any
      }
  }

  handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status+" ("+response.statusText+")");
    }
    return response;
  }

  static getDerivedStateFromProps(nextProps, state) {
//    clearInterval(state.itemTimer);
    if( nextProps.fieldName !== state.fieldName ) {
//      this.setState({option: nextProps.option});
      return { stage: nextProps.stage,
               fieldName: nextProps.fieldName,
               field: nextProps.field,
               siteLoc: nextProps.siteLoc,
               tags: nextProps.tags};
    }
	return state;
  }

  componentDidUpdate( prevProps, prevState ) {
	if( this.state.fieldName !== prevState.fieldName ) {
      this.fetchSite(this.state.fieldName);
    }
  }

  fetchSite(fn) {
    const clsMthd = "Field.fetchList";
    const myRequest = SERVERROOT + "/field/objects/"+fn;
    if( myRequest !== null ) {
      const request = async () => {
        try {
          const response = await fetch(myRequest);
          const json = await response.json();
          this.setState( {field: json.field,
                          tags: json.tags,
                          siteLoc: json.siteLocation,
                          updateData: false,
                          updateDisplay:true,
                          stage: "dataFetched" } );
        } catch( e ) {
          let emsg = "Problem fetching field objects for field "+fn;
          alert(emsg+"\n"+e);
          Log.error(emsg+" - "+e, clsMthd);
        }
      }
      request();
    }
  }

  componentDidMount() {
    this.fetchSite(this.state.fieldName);
    var myTimerID = setInterval(() => {this.fetchSite(this.state.fieldName)}, 60000 );
    this.setState( {unitTimer: myTimerID } );
  }

  componentWillUnmount() {
    if( this.state.unitTimer !== null ) {
      clearInterval(this.state.unitTimer);
    }
    if( this.state.itemTimer !== null ) {
      clearInterval(this.state.itemTimer);
    }
  }

  render() {
    switch (this.state.stage) {
      case "begin":
        return <Waiting />
      case "dataFetched":
        return <FieldDisplay field={this.state.field}
                             tags ={this.state.tags}
                             siteLoc={this.state.siteLoc}
                             tankType={this.state.tankType} />
      default:
        return <DefaultContents />
    }
  }
}

export default Field;