import {SERVER} from "./ServerUrl";
import {ResponseHandler, MyHeaders} from './HttpHelper';

const SERVER_URL = `${SERVER}/garden`

export default class GardenApi
{
    static async getGardens()
    {
        const options = 
        {
            headers: MyHeaders.getHeaders(),
            method: "get"
        };

        return fetch(SERVER_URL, options).then(response => ResponseHandler.handle(response));
    }

    static async getGarden(id)
    {
        const options = 
        {
            headers: MyHeaders.getHeaders(),
            method: "get"
        };

        return fetch(`${SERVER_URL}/${id}`, options).then(response => ResponseHandler.handle(response));
    }

    static async createGarden(garden)
    {
        const options =
        {
            method: "post",
            headers: MyHeaders.getHeadersWithContentType(),
            body: JSON.stringify(garden)
        };

        return fetch(SERVER_URL, options).then(response => ResponseHandler.handle(response));
    }

    static async updateGarden(id, garden)
    {
        const options =
        {
            method: "put",
            headers: MyHeaders.getHeadersWithContentType(),
            body: JSON.stringify(garden)
        };

        return fetch(`${SERVER_URL}/${id}`, options).then(response => ResponseHandler.handle(response));
    }

    static async deleteGarden(id)
    {
        const options = 
        {
            headers: MyHeaders.getHeaders(),
            method: "delete"
        };

        return fetch(`${SERVER_URL}/${id}`, options).then(response => ResponseHandler.handle(response));
    }

}