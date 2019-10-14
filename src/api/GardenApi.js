import {SERVER} from "./ServerUrl";
import ResponseHandler from './ResponseHandler';

const SERVER_URL = `${SERVER}/garden`

export default class GardenApi
{
    static async getGardens()
    {
        const options = 
        {
            method: "get"
        };

        return fetch(SERVER_URL, options).then(response => ResponseHandler.handle(response));
    }

    static async getGarden(id)
    {
        const options = 
        {
            method: "get"
        };

        return fetch(`${SERVER_URL}/${id}`, options).then(response => ResponseHandler.handle(response));
    }

    static async createGarden(garden)
    {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        const options =
        {
            method: "post",
            headers: headers,
            body: JSON.stringify(garden)
        };

        return fetch(SERVER_URL, options).then(response => ResponseHandler.handle(response));
    }

    static async updateGarden(id, garden)
    {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        const options =
        {
            method: "put",
            headers: headers,
            body: JSON.stringify(garden)
        };

        return fetch(`${SERVER_URL}/${id}`, options).then(response => ResponseHandler.handle(response));
    }

    static async deleteGarden(id)
    {
        const options = 
        {
            method: "delete"
        };

        return fetch(`${SERVER_URL}/${id}`, options).then(response => ResponseHandler.handle(response));
    }

}