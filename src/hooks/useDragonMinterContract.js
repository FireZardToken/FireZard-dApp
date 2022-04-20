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

import DRAGON_MINTER from "../contracts/DragonMinter.json";

import FireZardUiContext from '../context/FireZardUiContext';
import useFlameContract from './useFlameContract';

export default function useDragonMinterContract() {
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

    const { allowance, approve } = useFlameContract();

    const DragonMinterContractInstance = useMemo(
        () => new web3.eth.Contract(DRAGON_MINTER.abi, DRAGON_MINTER.networks[56].address),
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

    const getBlockConfirmationCap = async () => {
        return (await DragonMinterContractInstance.methods.getBlockConfirmationCap().call());
    }

    const lockPackage = async (nonces) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            const gasPrice = await web3.eth.getGasPrice();
            await DragonMinterContractInstance.methods.lockPackage(nonces).send({
                from: account,
                gasPrice
            })
        } catch(err) {
            // if(err.code && err.code === 4001) {
            //     addNotification({
            //         message: 'You denied trasanction signature',
            //         type: 'warning',
            //     });
            // } else {
            //     addNotification({
            //         message: 'Lock Package Failed.',
            //         type: 'warning',
            //     });
            // }

            throw err;
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const initPackage = async (commitments) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }
        
        try {
            // const gasPrice = await web3.eth.getGasPrice();
            const flameAllowance = await allowance(DRAGON_MINTER.networks[56].address)

            if(flameAllowance > 0) {
                await DragonMinterContractInstance.methods.initPackage(commitments).send({
                    from: account,
                    // gasPrice
                })
            } else {
                await approve(DRAGON_MINTER.networks[56].address);
                await DragonMinterContractInstance.methods.initPackage(commitments).send({
                    from: account,
                    // gasPrice
                })
            }
            
        } catch(err) {
            // if(err.code && err.code === 4001) {
            //     addNotification({
            //         message: 'You denied trasanction signature',
            //         type: 'warning',
            //     });
            // } else {
            //     addNotification({
            //         message: 'Init Package Failed.',
            //         type: 'warning',
            //     });
            // }

            throw err;
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const openPackage = async (account, commitments) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }
        
        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await DragonMinterContractInstance.methods.openPackage(account, commitments).send({
                from: account,
                // gasPrice
            })
        } catch(err) {
            console.log(err)
            // if(err.code && err.code === 4001) {
            //     addNotification({
            //         message: 'You denied trasanction signature',
            //         type: 'warning',
            //     });
            // } else {
            //     addNotification({
            //         message: 'Open Package Failed.',
            //         type: 'warning',
            //     });
            // }

            throw err;
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const readPackage = async (commitments) => {
        return  await DragonMinterContractInstance.methods.readPackage(commitments).call();
    }

    return {
        getBlockConfirmationCap,
        initPackage,
        lockPackage,
        openPackage,
        readPackage
    };
}