import React, {Component} from 'react';
import {AnalogOutput} from '../objects/AO.js';
import {Tag} from '../objects/Tag.js';


class AOList extends Component {
  constructor(props) {
    super(props);
    console.log( "AOList: " + props.stage );
    this.state = {  };
  }

  render() {
    var json = this.props.aoData;
    var aoSelect = this.props.aoSelect;
    var aoList = [];
    var t0 = new Tag(0,'Create new tag',null,'AO',null,null,null,null,null,'Y');
    var ao0 = new AnalogOutput(0,t0,null,null ,null,null,null,null,null ,null,null,null,null,null);
    aoList.push(ao0);
    json.map(function(n,x){
        var t = new Tag(n.id,n.tag.name,n.tag.description,n.tag.tagTypeCode,n.tag.tagTypeId
                       ,n.tag.c1Lat,n.tag.c1Long,n.tag.c2Lat,n.tag.c2Long,n.tag.active);
        var ao = new AnalogOutput(n.tagId,t,n.zeroValue,n.maxValue
                                 ,n.histTypeCode,n.percent,n.slope,n.scanValue,n.scanTime
                                 ,n.prevValue,n.prevTime,n.lastHistValue,n.lastHistTime,n.unitId);
        return aoList.push( ao ); } );
    return ( 
      <div className="oms-tabs">
        <h2><div><img src="./images/spacer.png" alt="space" width="30px" height="2px"/>Analog Outputs</div></h2>
        <table>
          <thead className="fixedHeader">
            <tr>
              <th className={["oms-spacing-90","oms-underline"].join(' ')} >Name</th>
              <th className={["oms-spacing-50","oms-underline"].join(' ')} >Active</th>
              <th className={["oms-spacing-240","oms-underline"].join(' ')} >Description</th>
              <th className={["oms-spacing-50","oms-underline"].join(' ')} >Zero</th>
              <th className={["oms-spacing-50","oms-underline"].join(' ')} >Max</th>
              <th className={["oms-spacing-70","oms-underline"].join(' ')} >HType</th>
            </tr>
          </thead>
          <tbody className="scrollContent">
          {aoList.map(
            function(n,x){
              let z = n.tagId;
              return <tr key={x}>
                       <td className={["oms-spacing-90","oms-cursor-pointer","oms-fontsize-12"].join(' ')}>
                         <a id={z} onClick={() => {aoSelect({z})}} >
                           {n.tag.name}
                         </a>
                       </td>
                       <td className={["oms-spacing-50","oms-fontsize-12"].join(' ')}>{n.tag.active}</td>
                       <td className={["oms-spacing-240","oms-fontsize-12"].join(' ')}>{n.tag.description}</td>
                       <td className={["oms-spacing-50","oms-fontsize-12"].join(' ')}>{n.zeroValue}</td>
                       <td className={["oms-spacing-50","oms-fontsize-12"].join(' ')}>{n.maxValue}</td>
                       <td className={["oms-spacing-70","oms-fontsize-12"].join(' ')}>{n.histTypeCode}</td>
                     </tr>; 
            } )
          }
          </tbody>
        </table>
      </div>
    );
  }
  
}

export default AOList;
