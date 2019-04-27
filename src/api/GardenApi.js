import {SERVER} from "./ServerUrl";


export default class GardenApi
{
    static async getGardenInfo()
    {}

    static async getPlantedCrops()
    {
        const options = 
        {
            method: "get"
        };
        const  SERVER_URL = `${SERVER}/planting`;

        return fetch(SERVER_URL, options).then(response => response.json());

    }
}