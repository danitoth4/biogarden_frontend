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

    static async addCompanions(companions)
    {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        const options = {
            method: "post",
            headers: headers,
            body: JSON.stringify(companions)
        };
        return fetch(SERVER_URL, options).then();
    }

    static async deleteCompanions(companions)
    {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        const options = {
            method: "delete",
            headers: headers,
            body: JSON.stringify(companions)
        };
        return fetch(SERVER_URL, options).then();
    }
}
export default CompanionApi;