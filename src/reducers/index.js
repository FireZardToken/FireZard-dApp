import { combineReducers } from 'redux'
import { coinbaseAddress } from './coinbaseAddress'
import { isWalletConnect } from './isWalletConnect'
import { walletButtonText } from './walletButtonText'

export default history => combineReducers({
    isWalletConnect,
    coinbaseAddress,
    walletButtonText
})