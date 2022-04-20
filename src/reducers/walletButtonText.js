import {SET_CONNECTWALLETBUTTON_TEXT}  from '../constances';

export const walletButtonText = ( state = 'Connect', {type, payload}) => {

    switch (type) {
        case SET_CONNECTWALLETBUTTON_TEXT:
            return payload.data
    
        default:
            return state
    }
}