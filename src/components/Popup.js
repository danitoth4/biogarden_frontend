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
            console.log(this.state.crops);
            cropComponents = this.state.crops.map( (crop) =>
                <Crop key = {crop.id} crop={crop} cropSelected = {this.props.cropSelected}></Crop>
            );
        }

        return(
            <div className = "popup">
                <div className = "popup_inner">
                    <button onClick={this.props.deleteSelected}>Clear</button>
                    <h1>{this.props.text}</h1>
                    <hr />
                    {cropComponents ? cropComponents : <h4>Loading..</h4>}
                    <button onClick={this.props.closePopup}>Close</button>
                </div>
            </div>
        )
    }
}

export default Popup;