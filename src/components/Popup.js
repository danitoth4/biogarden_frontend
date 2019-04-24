import React from 'react';
import "../styles/Popup.css";
import Crop from "./Crop";


class Popup extends React.Component
{

    constructor(props)
    {
        super(props);

        this.state =
        {
            crops: null,
            loaded: false
        }

        props.cropData.then(data =>
            {
                this.setState(
                    {
                        crops: data,
                        loaded: true
                    }
                );                                       
            }
        );              
    }
    render()
    {    

        let cropComponents;
        if(this.state.crops)
        {
            cropComponents = this.state.crops.map( (crop) =>
                <Crop name = {crop.name} id = {crop.id}></Crop>
            );
        }

        return(
            <div className = "popup">
                <div className = "popup_inner">
                    <h1>{this.props.text}</h1>
                    {cropComponents ? cropComponents : <h4>Loading..</h4>}
                    <button onClick={this.props.closePopup}>Close</button>
                </div>
            </div>
        )
    }
}

export default Popup;