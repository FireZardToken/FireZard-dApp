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

import ZARD from "../constances/abis/zard_abi.json";

import FireZardUiContext from '../context/FireZardUiContext';

const MAX_LP = '100000000000000000000000000';

export default function useZardContract() {
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

    const ZARDContractInstance = useMemo(
        () => new web3.eth.Contract(ZARD.abi, ZARD.contractAddress),
        [web3]
    );


    const isConnected = () => {
        if(!address) {
            addNotification({
                message: 'Please connect your wallet to BSC network.',
                type: 'danger',
            });
            return false;
        }

        return true;
    }

    const isChainValid = () => {
        if (chainId !== 56 && chainId !== 97) {
            addNotification({
                message: 'Please check if BSC main or test network is chosen.',
                type: 'danger',
            });
            return false;
        }
        return true;
    };

    const transferZardToken = async(to, amount) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await ZARDContractInstance.methods.transfer(to, amount).send({
                from: account,
                // gasPrice
            })
            addNotification({
                message: `You have successfully transfer`,
                type: 'success',
            });
        } catch(err) {
            if(err.code && err.code === 4001) {
                addNotification({
                    message: 'You denied trasanction signature',
                    type: 'warning',
                });
            } else {
                addNotification({
                    message: 'Transfer Failed.',
                    type: 'warning',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const totalSupply = async () => {
        return (await ZARDContractInstance.methods.totalSupply().call());
    }

    const balanceOf = async (userAddr) => {
        return (await ZARDContractInstance.methods.balanceOf(userAddr).call())
    }

    const allowance = async (spender) => {
        return (await ZARDContractInstance.methods.allowance(account, spender).call())
    }

    const approveZard = async (spender) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await ZARDContractInstance.methods.approve(spender, MAX_LP).send({
                from: account,
                // gasPrice
            })
            addNotification({
                message: `You have successfully approved`,
                type: 'success',
            });
        } catch(err) {
            if(err.code && err.code === 4001) {
                addNotification({
                    message: 'You denied trasanction signature',
                    type: 'warning',
                });
            } else {
                addNotification({
                    message: 'Approve Failed.',
                    type: 'warning',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    

    return {
        totalSupply,
        balanceOf,
        transferZardToken,
        approveZard,
        allowance
    };
}