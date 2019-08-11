import {SERVER} from "./ServerUrl";

const  SERVER_URL = `${SERVER}/planting/3`;

export default class PlantingAPi
{
    static async getPlantedCrops()
    {
        const options = 
        {
            method: "get"
        };

        return fetch(SERVER_URL, options).then(response => response.json());

    }

    static async modifyCrops(plantingOperation)
    {
        if(plantingOperation.method === "ADDED")
            return this.plantCrops(plantingOperation);
        else
            return this.deleteCrops(plantingOperation);
    }

    static async plantCrops(plantingOperation)
    {
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        const options =
        {
            method: "post",
            headers: headers,
            body: JSON.stringify(plantingOperation)
        };
        return fetch(SERVER_URL, options).then(response => response.json());
    }
 
    static async deleteCrops(plantingOperation)
    {
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        const options =
        {
            method: "delete",
            headers: headers,
            body: JSON.stringify(plantingOperation)
        };
        return fetch(SERVER_URL, options).then(response => response.json());
    }
}