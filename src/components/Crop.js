import React from 'react';
import CropApi from "../api/CropApi";
import  {Text, Box, Image, Heading} from 'grommet';
import {Link} from 'react-router-dom';
import {Add, Trash} from 'grommet-icons';

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
            alignSelf: "center",
            width: "30px",
            height: "30px",
            margin: "1%"
        }
        if (this.state.crop)
        return(
                <Box round pad = "xsmall" margin = "xsmall" align = "center"  background = {{color: "light-1", opacity: "0.8"}} direction = "row" >            
                    <Image style = {style} src = {this.state.crop.imageUrl}/>
                    <Heading color = "black" level={3} style = {style}>{this.state.crop.name}</Heading>
                </Box>
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