import React from 'react';
import { Button, Form, FormField  } from 'grommet';
import LoginApi from '../api/LoginApi';


export default class LoginForm extends React.Component
{
    render()
    {
        return(
            <div>
                <Form onSubmit = {(login) => this.submit(login)}>
                    <FormField name = "username" label = "Username" required = {true} />
                    <FormField name = "password" label = "Password" required = {true} />
                    <Button primary = {true} alignSelf = "center" color = "neutral-1" label = "Save" type = "submit"/>
                </Form>
            </div>
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