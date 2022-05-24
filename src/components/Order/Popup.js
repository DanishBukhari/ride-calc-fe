import React from "react";
import "./Popup.css";
import Select from 'react-select';



// const PopupParameters = (props) => {
//  const [driver, name] = React.useState("");
// }


const aquaticCreatures = [
    { label: 'Shark', value: 'Shark' },
    { label: 'Dolphin', value: 'Dolphin' },
    { label: 'Whale', value: 'Whale' },
    { label: 'Octopus', value: 'Octopus' },
    { label: 'Crab', value: 'Crab' },
    { label: 'Lobster', value: 'Lobster' },
  ];
  

const Popup = (props) => {
  return (
    <div className="popup-box">
      <div className="box">
        <h1>Driver</h1>
      <Select
        options={aquaticCreatures} onChange={()=>{
            // name = this.value
            console.log('called');

            }
        }
      />

        <span className="close-icon" onClick={props.handleClose}>x</span>
        {props.content}
        
      </div>
    </div>
  );
};


export default Popup;
