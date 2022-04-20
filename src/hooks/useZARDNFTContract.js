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

import ZARD_NFT from "../contracts/FireZardNFT.json";

import FireZardUiContext from '../context/FireZardUiContext';


export default function useZARDNFTContract() {
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

    const ZARDNFTContractInstance = useMemo(
        () => new web3.eth.Contract(ZARD_NFT.abi, ZARD_NFT.networks[56].address),
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

    const transferZardNFTToken = async(to, amount) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await ZARDNFTContractInstance.methods.transfer(to, amount).send({
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
        return (await ZARDNFTContractInstance.methods.totalSupply().call());
    }

    const balanceOf = async (userAddr) => {
        return (await ZARDNFTContractInstance.methods.balanceOf(userAddr).call())
    }

    const allowance = async (spender) => {
        return (await ZARDNFTContractInstance.methods.allowance(account, spender).call())
    }

    const approveZardNFT = async (spender, amount) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await ZARDNFTContractInstance.methods.approve(spender, amount).send({
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
        transferZardNFTToken,
        approveZardNFT,
        allowance
    };
}