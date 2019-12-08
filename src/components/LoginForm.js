import React from 'react';
import { Button, Form, FormField, Box, Grid  } from 'grommet';
import LoginApi from '../api/LoginApi';
import backgroundPath from '../backgroundPath.js'

export default class LoginForm extends React.Component
{
    render()
    {
        return(            
            <Box align="center" justify="center" height  = "100vh">
                <Form onSubmit = {(login) => this.submit(login)}>
                    <Box background="light-1" pad = "large" elevation = "xlarge" round justify = "center">
                        <FormField name = "username" label = "Username" required = {true} />
                        <FormField name = "password" label = "Password" required = {true} type="password" />
                        <Button primary = {true} color = "neutral-1" label = "Login" type = "submit"/>
                    </Box>
                </Form>
            </Box>
        );
    }

    async submit(login)
    {
        let response = await LoginApi.getToken(login.value.username, login.value.password);
        if(response.error)
        {
            console.log(response.error)
        }
        else
        {            
            sessionStorage.setItem('bearerToken', response.access_token);
            sessionStorage.setItem('refreshToken', response.refresh_token);
            this.props.history.push('/');         
        }
    }
}