import { SET_COINBASE_ADDRESS } from "../constances";

export const setCoinbaseAddressAction = address => ({ type: SET_COINBASE_ADDRESS, payload: { data: address } })