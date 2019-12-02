import {SERVER} from "./ServerUrl";
import {ResponseHandler, MyHeaders} from './HttpHelper';

const SERVER_URL = `${SERVER}/companions`

class CompanionApi
{
    static async getAllCompanions()
    {
        const options = {
            headers: MyHeaders.getHeaders(),
            method: "get"
        }

        return fetch(SERVER_URL, options).then(response => ResponseHandler.handle(response));
    }

    static async getCompanions(id)
    {
        const options = {
            headers: MyHeaders.getHeaders(),
            method: "get"
        };

        return fetch(`${SERVER_URL}/${id}`, options).then(response => ResponseHandler.handle(response));
    }

    static async addCompanion(companion)
    {
        const options = {
            method: "post",
            headers: MyHeaders.getHeadersWithContentType(),
            body: JSON.stringify(companion)
        };
        return fetch(SERVER_URL, options).then(response => ResponseHandler.handle(response));
    }

    static async deleteCompanion(id)
    {
        const options = {
            method: "delete",
            headers: MyHeaders.getHeaders()
        };
        return fetch(`${SERVER_URL}/${id}`, options).then(response => ResponseHandler.handle(response));
    }
}
export default CompanionApi;