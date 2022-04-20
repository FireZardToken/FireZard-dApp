import http from "../services/http";

export default class StateApi {
    static async getStepStateData(user, type) {
        let response = null;
        try {
            response = await http.get(`/state/${user}/${type}`);
        } catch (e) {
            console.log(e.message);
            throw e;
        }

        return response.data;
    }

    static async getStateData(user, type, step) {
        let response = null;
        try {
            response = await http.get(`/state/${user}/${type}/${step}`);
        } catch (e) {
            console.log(e.message);
            throw e;
        }

        return response.data;
    }

    static async setStateData(data) {
        let response = null;
        try {
            response = await http.post(`/state`, data);
        } catch (e) {
            console.log({e})
            console.log(e.message);
            throw e;
        }
        console.log(response);
        return response.data;
    }
}
