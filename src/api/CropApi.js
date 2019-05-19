import {SERVER} from "./ServerUrl";


const SERVER_URL = `${SERVER}/crop`;

class CropApi
{

    static async getAllCrops()
    {
        const options = 
        {
            method: "get"
        };

        return fetch(SERVER_URL, options).then(response => response.json());
    }

    static async getCrop(id)
    {
        const options =
        {
            method: "get"
        };
        return fetch(`${SERVER_URL}/${id}`, options).then(response =>response.json())
    }

    static async deleteCrop(cropId)
    {
        const options =
        {
            method: "delete"
        }

        return fetch(`${SERVER_URL}/${cropId}`, options);
    }
}

export default CropApi;



