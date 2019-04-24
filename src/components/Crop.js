import React from 'react';
import deleteicon from  '../content/delete.png';
import CropApi from "../api/CropApi"

export default class Crop extends React.Component
{
    constructor(props)
    {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
    }

    render()
    {
        const style = 
        {
            display: "inline",
            width: "10%",
            height: "10%"
        }
        return(
            <div>
                {this.props.name}
                <img src = {deleteicon} alt = "meaningfull text" style = {style} onClick = {this.handleDelete}/>
            </div>
        );
    }

    handleDelete()
    {

        if(this.props.id)
        {
            console.log('fccfd');
            CropApi.deleteCrop(this.props.id)
        }
    }
}