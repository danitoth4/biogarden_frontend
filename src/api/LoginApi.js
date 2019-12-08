const config = {
    clientId: "client",
    clientSecret: "secret"
}

const tokenUrl = "http://localhost:8081/oauth/token";


export default class LoginApi
{    
    static async getToken(username, password)
    {
        let headers = new Headers();
        headers.append('Content-Type','application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + btoa(config.clientId + ':' + config.clientSecret));
        let formData = [];
        let body = {
            'grant_type': 'password',
            'username': username,
            'password': password
        };
        for (var property in body) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(body[property]);
            formData.push(encodedKey + "=" + encodedValue);
        }
        formData = formData.join("&");
        const options = {
            method: "post",
            headers: headers,
            body: formData
        }
        let response = await fetch(tokenUrl, options).then(r => {
            if(r.ok)
                return r.json();
        });

        if(!response)
            response = {
                error: "Couldn't login, please try again"
            }
        return response;
    }

    static async refreshToken(refreshToken)
    {
        let headers = new Headers();
        headers.append('Content-Type','application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + btoa(config.clientId + ':' + config.clientSecret));
        let formData = [];
        let body = {
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken
        };
        for (var property in body) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(body[property]);
            formData.push(encodedKey + "=" + encodedValue);
        }
        formData = formData.join("&");
        const options = {
            method: "post",
            headers: headers,
            body: formData
        }
        let response = await fetch(tokenUrl, options).then(r => {
            if(r.ok)
                return r.json();
        });

        if(!response)
            response = {
                error: "Session expired, please try again"
            }
        return response;
    }
}