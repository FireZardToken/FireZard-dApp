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

// import FLAME from "../contracts/FLAME_MOCK.json";
import FLAME from "../constances/abis/flame_abi.json";

import FireZardUiContext from '../context/FireZardUiContext';

const MAX_LP = '1000000000000000000000000';

export default function useFlameContract() {
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

    const FlameContractInstance = useMemo(
        // () => new web3.eth.Contract(FLAME.abi, FLAME.networks[56].address),
        () => new web3.eth.Contract(FLAME.abi, FLAME.contractAddress),
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

    const transferFlameToken = async(to, amount) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await FlameContractInstance.methods.transfer(to, amount).send({
                from: account,
                // gasPrice
            })
            addNotification({
                message: `You have successfully transfer`,
                type: 'warning',
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
        return (await FlameContractInstance.methods.totalSupply().call());
    }

    const balanceOf = async (userAddr) => {
        return (await FlameContractInstance.methods.balanceOf(userAddr).call())
    }

    const allowance = async (spender) => {
        return (await FlameContractInstance.methods.allowance(account, spender).call())
    }

    const approve = async (spender) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await FlameContractInstance.methods.approve(spender, MAX_LP).send({
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

    const burn = async (amount) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await FlameContractInstance.methods.burn(amount).send({
                from: account,
                // gasPrice
            })
            addNotification({
                message: `You have successfully burnt`,
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
                    message: 'Burn Failed.',
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
        allowance,
        transferFlameToken,
        approve,
        burn
    };
}