import { SET_WALLET_CONNECTION_STATE } from "../constances";

export const setWalletConnectStateAction = state => ({ type: SET_WALLET_CONNECTION_STATE, payload: { data: state } })