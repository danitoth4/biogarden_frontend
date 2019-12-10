import React from 'react';
import { Button, Form, FormField, Box, Select  } from 'grommet';
import CropApi from '../api/CropApi';


export default class NewCropPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            type: null
        }
    }

    render()
    {
        return(
            <Box align="center" justify="center" height  = "100vh">
                <Form onSubmit = {(crop) => {
                        crop.value.width = Number(crop.value.width); 
                        crop.value.length = Number(crop.value.length);
                        crop.value.type = this.state.type ? this.state.type.toUpperCase() : null;
                        CropApi.createCrop(crop.value).then(() => this.props.history.push("/")) }}>
                    <Box background="light-1" pad = "large" gap = "small" elevation = "xlarge" round justify = "center">  
                        <FormField name = "name" label = "Name" required = {true} />
                        <FormField name = "imageUrl" label = "Image Url" required = {true} />
                        <FormField name = "description" label = "Description" />
                        <FormField validate = {validateWidthAndLength} name = "width" label = "Width" />
                        <FormField validate = {validateWidthAndLength} name = "length" label = "Length" />
                        <Select
                            options = {['Legumes', 'Root', 'Leaf', 'Fruit']}
                            value = {this.state.type || "Select a type"}
                            onChange={({ option }) => this.setState({type: option})}
                        />
                        <Button primary = {true} alignSelf = "center" color = "neutral-1" label = "Save" type = "submit"/>
                    </Box>
                </Form>
            </Box>
        );
    }
}

function validateWidthAndLength(fieldvalue, objectvalue)
{
    let num =  Number(fieldvalue);
    if( (Number.isNaN(num) || num <= 0) || fieldvalue % 1 !== 0)
    {
        return "Please enter a positive integer";
    }
}