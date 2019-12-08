import React from 'react';
import { Button, Form, FormField, Box  } from 'grommet';
import GardenApi from '../api/GardenApi';
import backgroundPath from '../backgroundPath.js'


export default class NewGardenPage extends React.Component
{
    render()
    {
        return(
            <Box align="center" justify="center" height  = "100vh">
                <Form onSubmit = {(garden) => { garden.value.width = Number(garden.value.width); garden.value.length = Number(garden.value.length); GardenApi.createGarden(garden.value).then( this.props.history.push("/")) }}>
                    <Box background="light-1" pad = "large" elevation = "xlarge" round justify = "center">  
                        <FormField name = "name" label = "Name" required = {true} />
                        <FormField validate = {validateWidthAndLength} name = "width" label = "Width" />
                        <FormField validate = {validateWidthAndLength} name = "length" label = "Length" />
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