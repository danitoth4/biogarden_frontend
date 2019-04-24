import {SERVER} from "./ServerUrl";

const SERVER_URL = `${SERVER}/companions`

class CompanionApi
{
    static async getAllCompanions()
    {
        const options = {
            method: "get"
        }

        return fetch(SERVER_URL, options).then(response => response.json());
    }
}