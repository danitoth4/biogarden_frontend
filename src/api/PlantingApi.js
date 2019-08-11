import {SERVER} from "./ServerUrl";

const  SERVER_URL = `${SERVER}/planting`;

export default class PlantingAPi
{
    static async getPlantedCrops(id, zoom)
    {
        const options = 
        {
            method: "get"
        };

        return fetch(`${SERVER_URL}/${id}?zoom=${zoom}`, options).then(response => response.json());

    }

    static async modifyCrops(plantingOperation, id, zoom)
    {
        if(plantingOperation.method === "ADDED")
            return this.plantCrops(plantingOperation, id, zoom);
        else
            return this.deleteCrops(plantingOperation, id, zoom);
    }

    static async plantCrops(plantingOperation, id, zoom)
    {
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        const options =
        {
            method: "post",
            headers: headers,
            body: JSON.stringify(plantingOperation)
        };
        return fetch(`${SERVER_URL}/${id}?zoom=${zoom}`, options).then(response => response.json());
    }
 
    static async deleteCrops(plantingOperation, id, zoom)
    {
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        const options =
        {
            method: "delete",
            headers: headers,
            body: JSON.stringify(plantingOperation)
        };
        return fetch(`${SERVER_URL}/${id}?zoom=${zoom}`, options).then(response => response.json());
    }
}