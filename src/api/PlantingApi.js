import {SERVER} from "./ServerUrl";

const  SERVER_URL = `${SERVER}/planting`;

export default class PlantingAPi
{
    static async getPlantedCrops(id, zoom, startX, startY, endX, endY)
    {
        const options = 
        {
            method: "get"
        };

        return fetch(`${SERVER_URL}/${id}?zoom=${zoom}&startX=${startX}&startY=${startY}&endX=${endX}&endY=${endY}`, options).then(response => response.json());

    }

    static async modifyCrops(plantingOperation, id, zoom, startX, startY, endX, endY)
    {
        plantingOperation.x1 =  Math.round(plantingOperation.x1 * zoom) + startX;
        plantingOperation.y1 =  Math.round(plantingOperation.y1 * zoom) + startY;
        plantingOperation.x2 =  Math.round(plantingOperation.x2 * zoom) + startX;
        plantingOperation.y2 =  Math.round(plantingOperation.y2 * zoom) + startY;
        if(plantingOperation.method === "ADDED")
            return this.plantCrops(plantingOperation, id, zoom, startX, startY, endX, endY);
        else
            return this.deleteCrops(plantingOperation, id, zoom, startX, startY, endX, endY);
    }

    static async plantCrops(plantingOperation, id, zoom, startX, startY, endX, endY)
    {
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        const options =
        {
            method: "post",
            headers: headers,
            body: JSON.stringify(plantingOperation)
        };
        return fetch(`${SERVER_URL}/${id}?zoom=${zoom}&startX=${startX}&startY=${startY}&endX=${endX}&endY=${endY}`, options).then(response => response.json());
    }
 
    static async deleteCrops(plantingOperation, id, zoom, startX, startY, endX, endY)
    {
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        const options =
        {
            method: "delete",
            headers: headers,
            body: JSON.stringify(plantingOperation)
        };
        return fetch(`${SERVER_URL}/${id}?zoom=${zoom}&startX=${startX}&startY=${startY}&endX=${endX}&endY=${endY}`, options).then(response => response.json());
    }
}