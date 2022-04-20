import { SET_WALLET_CONNECTION_STATE } from "../constances";

export const isWalletConnect = ( state = false, { type, payload } ) => {

    switch (type) {
        case SET_WALLET_CONNECTION_STATE:
            return payload.data;
    
        default:
            return state;
    }
}