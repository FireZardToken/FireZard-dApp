import http from "../services/http";

export default class NftTokenApi {
    static async getTokenData(tokenID) {
        let response = null;
        try {
            response = await http.get(`/nft/${tokenID}`);
        } catch (e) {
            console.log(e.message);
            throw e;
        }

        return response.data;
    }

    static async createNewCollection(data) {
        let response = null;
        try {
            response = await http.post(`/nft`, data); console.log({response})
        } catch (e) {
            console.log({e})
            console.log(e.message);
            throw e;
        }

        return response.data;
    }
}
