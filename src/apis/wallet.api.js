import http from "../services/http";

export default class WalletApi {
    static async getCollections(account, type) {
        let response = null;
        try {
            response = await http.get(`/wallet/colletions?id=${account}&type=${type}`);
        } catch (e) {
            console.log(e.message);
            throw e;
        }

        return response.data;
    }
}
