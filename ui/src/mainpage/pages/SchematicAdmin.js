/*************************************************************************
 * SchematicAdmin.js
 * Copyright (C) 2018  A. E. Van Ness
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

import React, {Component} from 'react';
import {SERVERROOT}    from '../../Parameters.js';
import OMSRequest      from '../requests/OMSRequest.js';
import Log             from '../requests/Log.js';

import DefaultContents from './DefaultContents.js';
import SchematicForm   from './forms/SchematicForm.js';
import SchematicList   from './lists/SchematicList.js';
import Waiting         from './Waiting.js';
import {ChildValue}    from './objects/ChildValue.js';
import {Schematic}     from './objects/Schematic.js';


class SchematicAdmin extends Component {
  constructor(props) {
    super(props);
    Log.info( "SchematicAdmin: " + props.stage );
    this.state = {
      stage: props.stage,
      updateData: false,
      updateDisplay: true,
      returnedText: null,
      schematic: null,
      sco: null,
      typeList: null,
      inpTags: null,
      outTags: null,
      color: "green",
      type: props.type,
      nextCorner: 1
    };
    this.handleFieldChange      = this.handleFieldChange.bind(this);
    this.handleSchematicCopy    = this.handleSchematicCopy.bind(this);
    this.handleSchematicSelect  = this.handleSchematicSelect.bind(this);
    this.handleSchematicUpdate  = this.handleSchematicUpdate.bind(this);
    this.handleQuit             = this.handleQuit.bind(this);
    this.handleAdd              = this.handleAdd.bind(this);
    this.handleEdit             = this.handleEdit.bind(this);
    this.handleItemChange       = this.handleItemChange.bind(this);
    this.handleMouseUp          = this.handleMouseUp.bind(this);
    this.finishSCMFetch         = this.finishSCMFetch.bind(this);
    this.finishTypesFetch       = this.finishTypesFetch.bind(this);
    this.finishInpTagFetch      = this.finishInpTagFetch.bind(this);
    this.finishOutTagFetch      = this.finishOutTagFetch.bind(this);
  }
  
  handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status+" ("+response.statusText+")");
    }
    return response;
  }

/*
  getDerivedStateFromProps(nextProps,prevState) {
    Log.info( "SchematicAdmin.getDerivedState" + nextProps.stage );
    if(  (nextProps.stage !== prevState.stage) 
      || (nextProps.type != prevState.type ) )
    {
      this.setState({ stage: nextProps.stage,
                      type: nextProps.type,
                      updateData: true,
                      updateDisplay: false,
                      returnedText: null });
    }
  }
*/
/* */  
  componentWillReceiveProps(nextProps) {
    Log.info( "SchematicAdmin.willRcvProps = " + nextProps.stage + "/" + nextProps.type );
    if(  (nextProps.stage !== this.state.stage) 
      || (nextProps.type  !== this.state.type ) )
    {
//      this.fetchList();
      this.setState({ stage: nextProps.stage,
                      type: nextProps.type,
                      updateData: true,
                      updateDisplay: false,
                      returnedText: null });
    }
  }
/* */

  shouldComponentUpdate(nextProps,nextState) {
    let sts = nextState.updateDisplay;
    const clsMthd = "SchematicAdmin.shouldUpdate";
    if( nextState.stage !== nextProps.stage ) { sts = true; }
    if( nextState.type  !== nextProps.type  ) { sts = true; }
    Log.info( "state? " + nextState.stage + "/" + nextProps.stage
            + ", display: " + (sts?"T":"F") 
            + ", data: " + (nextState.updateData?"T":"F"), clsMthd );
    Log.info( "props? : display: " 
            + (nextProps.updateDisplay?"T":"F") 
            + ", data: " + (nextProps.updateData?"T":"F"), clsMthd );
    Log.info("type (props:" + nextProps.type+", state:"+nextState.type+")", clsMthd);
//    if( nextProps.type !== nextState.type ) {
//      this.fetchList();
//    }
    return sts;
  }
  
  finishSCMFetch( req ) {
    let sd = req;
    const scm = new Schematic( sd.id, sd.name, sd.description, sd.active, sd.tagTypeCode, sd.tagTypeId
                             , sd.misc, sd.c1Lat, sd.c1Long, sd.c2Lat, sd.c2Long, sd.childTags);
//    ChildValue                i,n,d,a,tt,ttid,m,c1Lt,c1Lg, c2Lt,c2Lg,pid,rtid
//                             ,itId,itName,itVal,itType,irtid,itMx,itz,iac
//                             ,otId,otName,otVal,otType,ortid,otMx,otz,oac                             
    const item = new ChildValue( 0, 'New Item', '', 'Y', 'SCO', 0, '', null, null
                               , null, null, sd.id, null
                               ,  0, '', 0, '', 0, 0, 0, 'darkgreen' 
                               ,  0, '', 0, '', 0, 0, 0, 'darkgreen' );
    let newt = Object.assign({},item);
    if( sd.childTags === null || sd.childTags === undefined ) {
      sd.childTags = [];
    }
    sd.childTags.unshift(newt);
    this.setState({stage: "itemRetrieved", updateDisplay: true, schematic:scm, sco:item });
  }
  
  finishTypesFetch(req) {
    let typeList = req;
//    req.map(function(n,x){ return privs.push(n.id); } )
//    let rnew = Object.assign({},this.state.role);
//    rnew.privs = privs;    
    this.setState({stage: "itemRetrieved", updateDisplay: true, typeList:typeList });
  }
  
  finishInpTagFetch(req) {
    let inpTags = req;
    this.setState({stage: "itemRetrieved", updateDisplay: true, inpTags: inpTags });
  }

  finishOutTagFetch(req) {
    let outTags = req;
    this.setState({stage: "itemRetrieved", updateDisplay: true, outTags: outTags });
  }

  fetchFormData( myRequest ) {
    const loc = "SchematicAdmin.select";
    let req0 = new OMSRequest(loc, myRequest, 
                            "Problem selecting schematic "+myRequest, this.finishSCMFetch);
    req0.fetchData();
    let req2 = new OMSRequest(loc, SERVERROOT + "/schematic/objTypeList",
                            "Problem retrieving type list ", this.finishTypesFetch);
    req2.fetchData();
    let req3 = new OMSRequest(loc, SERVERROOT + "/tag/types/AI,DI",
                            "Problem retrieving input tag list", this.finishInpTagFetch);
    req3.fetchData();
    this.setState({schematic:null, sco:null, typeList:null, inpTags:null})    
    let req4 = new OMSRequest(loc, SERVERROOT + "/tag/types/AO,DO",
                            "Problem retrieving output tag list", this.finishOutTagFetch);
    req4.fetchData();
    this.setState({schematic:null, sco:null, typeList:null, outTags:null})    
  }

  
  handleSchematicSelect(event) {
    let now = new Date();
    const id = event.z;
    Log.info( "SchematicAdmin.SchematicSelect " + now.toISOString() );
    const myRequest=SERVERROOT + "/schematic/" + id;
    this.fetchFormData(myRequest); 
  }

  validateForm( x ) {
    let doSubmit = true;
    let msg = "The following fields ";
    if( x.statusId === 0 ) {
        doSubmit = false;
        msg += "schematic status, ";
    }
    if( ! doSubmit ) {
      msg += " must be selected!";
      alert(msg);
    }
    return doSubmit;
  }

  updateSchematic(id) {
    const clsMthd = "SchematicAdmin.updateSchematic";
    let newt = Object.assign({},this.state.schematic);
    let method = "PUT";
    let url = SERVERROOT + "/schematic/update";
    if( id === 0 ) {
      newt.id = 0;
      method = "POST";
      url = SERVERROOT + "/schematic/insert";
    }
    var sct = newt.childTags;
    var sco = sct.shift();
    if( sco.name !== "New Item" ) {
      sct.unshift(sco);
    }
    newt.childTags = sct;
    var b = JSON.stringify( newt );
    const request = async () => {
      await fetch(url, {method:method, headers:{'Content-Type':'application/json'}, body: b});
      Log.info( "update complete",clsMthd );
      alert("Update/insert complete on "+newt.name)
    }
    try {
      request();
    } catch( error ) {
      const emsg = "Problem "+(id===0?"inserting":"updating")+" schematic id="+id; 
      alert(emsg+"\n"+error);
      Log.error(emsg+" - " + error,clsMthd);
    }
  }

  handleSchematicUpdate(event) {
    event.preventDefault();
    let x = this.state.schematic;
    let doSubmit = this.validateForm(x);
    if( doSubmit ) {
      const id = this.state.schematic.id;
      this.updateSchematic(id);
    }
  }
  
  handleSchematicCopy(event) {
    event.preventDefault();
    let x = this.state.schematic;
    let doSubmit = this.validateForm(x);
    if( doSubmit ) {
      const id = 0;
      this.updateSchematic(id);
    }
  }
  
  componentDidMount() {
    Log.info( "SchematicAdmin.didMount: " + this.state.stage );
    this.fetchList();
  }
    
  componentDidUpdate( prevProps, prevState ) {
    Log.info( "SchematicAdmin.didUpdate: " + this.state.stage );
  }

  handleMouseUp(event) {
      const e = event;
      const t = e.evt;
      var x = t.offsetX;
      var y = t.offsetY;

      let sconew = Object.assign({},this.state.sco);
      let nextCorner = this.state.nextCorner;
      Log.info( "ProcessUnitAdmin.mouseUp("+nextCorner+"): "+x+","+y);
      if( nextCorner === 1 ) {
        sconew.c1Lat = x;
        sconew.c1Long = y;
        nextCorner = 2;
      } else {
        sconew.c2Lat = x;
        sconew.c2Long = y;
        nextCorner = 1;        
      }
      this.setState( {sco: sconew, nextCorner:nextCorner} );
  }
  
  handleItemChange(id) {
    var sco = undefined;
    let cts = this.state.schematic.childTags;
    cts.forEach( function( e ) {
        if( e.id === parseInt(id,10) ) {
          sco = e;
        }
    } );
    return sco;
  };
  
  handleFieldChange(event) {
    const target = event.target;
    const value  = target.value;
    const name   = target.name;
    let np = name.split(".");
    let scmnew = Object.assign({},this.state.schematic);
    let sconew = Object.assign({},this.state.sco);
    if( np.length === 1 ) {
        const field = np[0];
        scmnew[field] = value;
    } else {
        const field = np[1];
        if( field === "id" ) {
          sconew = this.handleItemChange(value);
        } else if( field === "c2Lat" ) {
          let v = value;
          const c1Lt = sconew.c1Lat;
          switch(sconew.misc) { 
            case "G" : v = value; break;
            case "P" : v = value; break;
            case "PB": v = c1Lt+10; break;
            case "PL": v = c1Lt+15; break;
            case "PR": v = c1Lt+15; break;
            case "PT": v = c1Lt+10; break;
            case "RU": v = c1Lt+68; break;
            case "S" : v = c1Lt+100; break;
            case "TK": v = value; break;
            case "T" : v = value; break;
            case "VH": v = c1Lt+12; break;
            case "VV": v = c1Lt+24; break;
            default:   v = value; break;
          }
          sconew[field] = v;
        } else if( field === "c2Long") {
          let v = value;
          const c1Lg = sconew.c1Long;
          switch(sconew.misc)
          { case "G" : v = value; break;
            case "P" : v = value; break;
            case "PB": v = c1Lg+15; break;
            case "PL": v = c1Lg+10; break;
            case "PR": v = c1Lg+10; break;
            case "PT": v = c1Lg+15; break;
            case "RU": v = c1Lg+36; break;
            case "S" : v = c1Lg+100; break;
            case "TK": v = value; break;
            case "T" : v = value; break;
            case "VH": v = c1Lg+24; break;
            case "VV": v = c1Lg+12; break;
            default:   v = value; break;
          }
          sconew[field] = v;
        } else {
          sconew[field] = value;
        }
    }
    this.setState({schematic: scmnew, sco: sconew } );
  }
  
 
  fetchList() {
    const clsMthd = "SchematicAdmin.fetchList";
    const myRequest = SERVERROOT + "/tag/type/SCM";
    if( myRequest !== null ) {
      const request = async () => {
        const response = await fetch(myRequest);
        const json = await response.json();
        this.setState( {returnedText: json, 
                        updateData: false, 
                        updateDisplay:true,
                        stage: "dataFetched" } );
      }
      try {
        request();
      } catch( e ) {
        const emsg = "Problem fetching schematic list";
        alert(emsg+"\n"+e);
        Log.error(emsg+" - " + e, clsMthd);        
      }
    }
  }

  handleQuit(event) {
    event.preventDefault();
    this.fetchList();
    this.setState( {returnedText: null, 
                    updateData: true, 
                    updateDisplay:true,
                    schematic: null,
                    stage: "begin" } );
  }

  validateItem( sco ) {
    let doSubmit = true;
    let msg = "The following fields ";
    var delim = "";
    if( sco.id === null || sco.id === undefined ) {
      sco.id = 0;
    }
    if( sco.name === null || sco.name === "" || 
        sco.name === "New Item" || sco.name === undefined ) {
      doSubmit = false;
      msg += delim + " name";
      delim = ", ";
    }
    if( sco.misc === null || sco.misc === "" ) {
      doSubmit = false;
      msg += delim + " object type";
      delim = ", ";
    }
    if( sco.childTagId === null || sco.childTagId === "" || sco.childTagId === 0 ) {
      doSubmit = false;
      msg += delim + " child tag";
      delim = ", ";
    }
    if( sco.inpTagId === null || sco.inpTagId === "" || sco.inpTagId === 0 ) {
      doSubmit = false;
      msg += delim + " input tag";
      delim = ", ";
    }
    if( sco.outTagId === null || sco.outTagId === "" || sco.outTagId === 0 ) {
      if( (sco.misc === "HP") || (sco.misc === "VP") || (sco.misc === "HV") || (sco.misc === "VV") ) {
        doSubmit = false;
        msg += delim + " output tag";
        delim = ", ";
      }
    }
    if( (sco.c1Lat ===null?true:parseInt(sco.c1Lat,10)===0) || 
        (sco.c1Long===null?true:parseInt(sco.c1Long,10)===0) ) {
      doSubmit = false;
      msg += delim + " NW Corner";
      delim = ", ";
    }
    if( (sco.c2Lat ===null?true:parseInt(sco.c2Lat,10)===0) || 
        (sco.c2Long===null?true:parseInt(sco.c2Long,10)===0) ) {
      doSubmit = false;
      msg += delim + " SE Corner";
      delim = ", ";
    }
    if( ! doSubmit ) {
      msg += " must be initialized/selected!";
      alert(msg);
    }
    return doSubmit;
  }

  handleAdd(event) {
    event.preventDefault();
    let scm = Object.assign({},this.state.schematic);
    var sco = Object.assign({},this.state.sco);
    if( this.validateItem(sco) ) {
      if( scm.childTags === null ) {
        scm.childTags = [];
      }
      scm.childTags.push(sco);
      sco = { id:0, name:'New Item', description:'', active:'Y', misc:"", tagTypeCode:'SCO'
            , tagTypeId:0, c1Lat:0, c1Long:0, c2Lat:0, c2Long:0, parentId:scm.id, relTagId:0
            , inpRelTagId:0, inpTagId:0, inpType:"", inpTagName:"", inpValue:0, inpMax:0, inpZero:0
            , outRelTagId:0, outTagId:0, outType:"", outTagName:"", outValue:0, outMax:0, outZero:0 };
      this.setState( {returnedText: null, 
                      updateData: true, 
                      updateDisplay:true,
                      schematic: scm,
                      sco: sco,
                      stage: "itemRetrieved" } );
    }
  }

  handleEdit(event) {
    event.preventDefault();
    let scm = Object.assign({},this.state.schematic);
    var sco = Object.assign({},this.state.sco);
    if( this.validateItem(sco) ) {
      if( sco.id === 0 && sco.name === "New Item" ) {
        alert( "This item needs to be added to the list before it can be modified" );
      } else {
        let sct = scm.childTags;
        for( var i=0; i<sct.length; i++ ) {
          if( sct[i].id === sco.id ) {
//            sct.splice(i,1);
            sct[i].name = sco.name;
            sct[i].description = sco.description;
            sct[i].c1Lat = sco.c1Lat;
            sct[i].c1Long = sco.c1Long;
            sct[i].c2Lat = sco.c2Lat;
            sct[i].c2Long = sco.c2Long;
            sct[i].inpTagId = (sco.inpTagId===null?undefined:sco.inpTagId);
            sct[i].outTagId = (sco.outTagId===null?undefined:sco.outTagId);
            sct[i].misc = sco.misc;
          }
        }
        this.setState( {returnedText: null, 
                        updateData: true, 
                        updateDisplay:true,
                        schematic: scm,
                        sco: sco,
                        stage: "itemRetrieved" } );
      }
    }
  }


  render() {
    Log.info("SchematicAdmin (render) - stage: "+this.state.stage);
    switch( this.state.stage ) {
  	  case "begin":
        return <Waiting />
      case "dataFetched":
        return <SchematicList schematicData   = {this.state.returnedText}
                              schematicSelect = {this.handleSchematicSelect}
                              handleQuit      = {this.handleQuit}
               />
      case "itemRetrieved":
        if( (this.state.schematic === null) || (this.state.typeList === null) || 
            (this.state.inpTags === null)   || (this.state.outTags === null)   ) {
          return <Waiting />
        } else {
          return <SchematicForm schematic     = {this.state.schematic}
                                sco           = {this.state.sco}
                                typeList      = {this.state.typeList}
                                inpTags       = {this.state.inpTags}
                                outTags       = {this.state.outTags}
                                schematicCopy = {this.handleSchematicCopy}
                                schematicUpdate = {this.handleSchematicUpdate}
                                fieldChange   = {this.handleFieldChange}
                                handleQuit    = {this.handleQuit}
                                handleAdd     = {this.handleAdd}
                                handleEdit    = {this.handleEdit}
                                handleMouseUp = {this.handleMouseUp}
                 />
        }
      default:
        return <DefaultContents />
    }
  }
}

export default SchematicAdmin;
