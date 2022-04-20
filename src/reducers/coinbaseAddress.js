import { SET_COINBASE_ADDRESS } from "../constances";

export const coinbaseAddress = (state = '', { type, payload }) => {

    switch (type) {
        case SET_COINBASE_ADDRESS:
            return payload.data
    
        default:
            return state
    }
}