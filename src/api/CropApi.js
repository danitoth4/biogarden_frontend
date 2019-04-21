import {SERVER} from "./ServerUrl";


const SERVER_URL = `${SERVER}/crop`;

class CropApi
{

    static async GetAllCrops()
    {
        const options = {
            method: "get"
        }

        return fetch(SERVER_URL, options).then(response => response.json());
    }
}



