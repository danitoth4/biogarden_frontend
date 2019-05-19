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

    static async getCompanions(id)
    {
        const options = {
            method: "get"
        };

        return fetch(`${SERVER_URL}/${id}`, options).then(response => response.json());
    }
}
export default CompanionApi;