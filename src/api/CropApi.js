import {SERVER} from "./ServerUrl";
import {ResponseHandler, MyHeaders} from './HttpHelper';


const SERVER_URL = `${SERVER}/crop`;

class CropApi
{

    static async getAllCrops()
    {
        const options = 
        {
            headers: MyHeaders.getHeaders(),
            method: "get"
        };

        return fetch(SERVER_URL, options).then(response => ResponseHandler.handle(response));
    }

    static async getCrop(id)
    {
        const options =
        {
            headers: MyHeaders.getHeaders(),
            method: "get"
        };
        return fetch(`${SERVER_URL}/${id}`, options).then(response =>  ResponseHandler.handle(response))
    }

    static async deleteCrop(cropId)
    {
        const options =
        {
            headers: MyHeaders.getHeaders(),
            method: "delete"
        }

        return fetch(`${SERVER_URL}/${cropId}`, options).then(response => ResponseHandler.handle(response));
    }
}

export default CropApi;



