import {SERVER} from "./ServerUrl";


const SERVER_URL = `${SERVER}/crop`;

class CropApi
{

    static async getAllCrops()
    {
        const options = 
        {
            method: "get"
        }

        return fetch(SERVER_URL, options).then(response => response.json());
    }

    static async deleteEvent(cropId)
    {
        const options =
        {
            method: "delete"
        }

        return fetch(`${SERVER_URL}/${cropId}`, options);
    }
}

export default CropApi;



