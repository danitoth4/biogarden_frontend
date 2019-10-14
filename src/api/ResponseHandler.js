import LoginApi from './LoginApi';

var Router = require('react-router');

export default class ResponseHandler
{
    static async handle(response)
    {
        if(response.ok)
        {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1)
            {
                return response.json();
            }
            else
            {
                console.log()
                return true;
            }
        }
        if(response.status === 401)
        {
            if(sessionStorage.getItem('refreshToken'))
            {
                let newToken = LoginApi.refreshToken(sessionStorage.getItem('refreshToken'));
                if(newToken.error)
                {
                    Router.useHistory().push('/login');
                }
                else
                {
                    sessionStorage.setItem('bearerToken', response.access_token);
                    sessionStorage.setItem('refreshToken', response.refresh_token);
                    return false;
                }
            }
        }
        return false;
    }       
}