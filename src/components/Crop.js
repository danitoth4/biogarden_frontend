import React from 'react';
import deleteicon from  '../content/delete.png';
import planting from '../content/planting.png';
import details from '../content/details.png';
import CropApi from "../api/CropApi";
import  {Text} from 'grommet';
import {Link} from 'react-router-dom';

export default class Crop extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            crop: this.props.crop
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount()
    {
        if(!this.props.crop)
        {
            if(this.props.id)
            {
                CropApi.getCrop(this.props.id).then(
                    data => this.setState({crop: data})
                );
            }
        }
    }

    render()
    {
        const style = 
        {
            display: "inline",
            width: "7%",
            height: "7%",
            margin: "1%"
        }
        if (this.state.crop)
        return(
            <div>
                <img style={style} alt = "" src = {this.state.crop.imageUrl}/>
                <Text style = {style}>{this.state.crop.name}</Text>
                <img src = {planting} alt = "" style = {style} title = "Plant" onClick = {() =>this.props.cropSelected(this.props.crop)}/>
                <Link to = {{pathname: `/crop/${this.state.crop.id}`}}>
                    <img src = {details} alt = "" style = {style} title = "Details"/>
                </Link>
                <img src = {deleteicon} alt = "" style = {style} title = "Delete" onClick = {this.handleDelete}/>
                <hr />             
            </div>
        );
        else
        return(<h1>Loading...</h1>)
    }

    handleDelete()
    {

        if(this.props.id)
        {
            CropApi.deleteCrop(this.props.id)
        }
    }
}