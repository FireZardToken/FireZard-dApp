import {
    useState,
    useMemo,
    useContext
} from 'react';
import {
    useWeb3React
} from '@web3-react/core';

import {
    getWeb3,
    numberToBN
} from '../utils';

import useNotification from './useNotification';

import DRAGON_VIWER from "../contracts/DragonCardView.json";

import FireZardUiContext from '../context/FireZardUiContext';

export default function useDragonCardViewerContract() {
    const {
        addNotification
    } = useNotification();
    const {
        setLastUpdatedTime
    } = useContext(FireZardUiContext);

    const {
        account,
        library,
        chainId
    } = useWeb3React();
    const address = account;
    const web3 = getWeb3(library);

    const DragonCardViewrContractInstance = useMemo(
        () => new web3.eth.Contract(DRAGON_VIWER.abi, DRAGON_VIWER.networks[56].address),
        [web3]
    );


    const isConnected = () => {
        if(!address) {
            addNotification({
                message: 'Please connect your wallet to BSC network.',
                type: 'warning',
            });
            return false;
        }

        return true;
    }

    const isChainValid = () => {
        if (chainId !== 56 && chainId !== 97) {
            addNotification({
                message: 'Please check if BSC main or test network is chosen.',
                type: 'warning',
            });
            return false;
        }
        return true;
    };

    const getView = async (tokenID) => {
        return (await DragonCardViewrContractInstance.methods.getView(tokenID).call());
    }

    const getRarity = async (tokenID) => {
        const dragonStats = await getView(tokenID);
        return dragonStats[4];
    }

    const getInventorySize = async (address) => {
        return (await DragonCardViewrContractInstance.methods.getInventorySize(address).call());
    }

    const getInventorySlots = async (user, startIndex, count) => {
        return (await DragonCardViewrContractInstance.methods.getInventorySlots(user, startIndex, count).call());
    }

    return {
        getRarity,
        getView,
        getInventorySize,
        getInventorySlots
    };
}