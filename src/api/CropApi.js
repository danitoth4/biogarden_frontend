import {SERVER} from "./ServerUrl";
import ResponseHandler from './ResponseHandler';


const SERVER_URL = `${SERVER}/crop`;

class CropApi
{

    static async getAllCrops()
    {
        const options = 
        {
            method: "get"
        };

        return fetch(SERVER_URL, options).then(response =>  ResponseHandler.handle(response));
    }

    static async getCrop(id)
    {
        const options =
        {
            method: "get"
        };
        return fetch(`${SERVER_URL}/${id}`, options).then(response =>  ResponseHandler.handle(response))
    }

    static async deleteCrop(cropId)
    {
        const options =
        {
            method: "delete"
        }

        return fetch(`${SERVER_URL}/${cropId}`, options).then(response => ResponseHandler.handle(response));
    }
}

export default CropApi;



