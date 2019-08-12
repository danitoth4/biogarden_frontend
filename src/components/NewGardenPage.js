import React from 'react';
import { Button, Form, FormField  } from 'grommet';
import GardenApi from '../api/GardenApi';


export default class NewGardenPage extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return(
            <div>
                <Form onSubmit = {(garden) => { garden.value.width = Number(garden.value.width); garden.value.length = Number(garden.value.length); GardenApi.createGarden(garden.value).then( this.props.history.push("/")) }}>
                    <FormField name = "name" label = "Name" required = {true} />
                    <FormField validate = {validateWidthAndLength} name = "width" label = "Width" />
                    <FormField validate = {validateWidthAndLength} name = "length" label = "Length" />
                    <Button primary = {true} alignSelf = "center" color = "neutral-1" label = "Save" type = "submit"/>
                </Form>
            </div>
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