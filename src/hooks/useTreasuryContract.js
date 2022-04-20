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

import Treasury from "../contracts/Treasury.json";

import FireZardUiContext from '../context/FireZardUiContext';

const MAX_LP = '1000000000000000000000000';

export default function useTreasuryContract() {
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


    const TreasuryContractInstance = useMemo(
        () => new web3.eth.Contract(Treasury.abi, Treasury.networks[56].address),
        [web3]
    );


    const isConnected = () => {
        if (!address) {
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

    const claimRewardToken = async (tokenID) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await TreasuryContractInstance.methods.claim(tokenID).send({
                from: account,
                // gasPrice
            })
            addNotification({
                message: `You have successfully claimed`,
                type: 'warning',
            });
        } catch (err) {
            throw err;
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const getRewardValue = async (rarity) => {
        const reward = await TreasuryContractInstance.methods.getRewardValue(rarity).call();
        return web3.utils.fromWei(reward);
    }


    return {
        claimRewardToken,
        getRewardValue
    };
}
