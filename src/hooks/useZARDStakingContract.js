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

import ZARD_STAKING from "../constances/abis/zard_staking_abi.json";

import FireZardUiContext from '../context/FireZardUiContext';


export default function useZARDStakingContract() {
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

    const ZARDStakingContractInstance = useMemo(
        () => new web3.eth.Contract(ZARD_STAKING.abi, ZARD_STAKING.contractAddress),
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

    const rewardRate = async () => {
        return (await ZARDStakingContractInstance.methods.rewardRate().call());
    }

    const getPendingDivs= async (userAddr) => {
        return (await ZARDStakingContractInstance.methods.getPendingDivs(userAddr).call());
    }

    const cliffTime = async () => {
        return (await ZARDStakingContractInstance.methods.cliffTime().call());
    }

    const totalEarnedTokens = async (userAddr) => {
        return (await ZARDStakingContractInstance.methods.totalEarnedTokens(userAddr).call());
    }

    const stakingTime = async (userAddr) => {
        return (await ZARDStakingContractInstance.methods.stakingTime(userAddr).call());
    }

    const depositedTokens = async (userAddr) => {
        return (await ZARDStakingContractInstance.methods.depositedTokens(userAddr).call());
    }
    
    const lastClaimedTime = async (userAddr) => {
        return (await ZARDStakingContractInstance.methods.lastClaimedTime(userAddr).call());
    }
    
    const getNumberOfHolders = async () => {
        return (await ZARDStakingContractInstance.methods.getNumberOfHolders().call());
    }

    const getStakingAndDaoAmount = async () => {
        return (await ZARDStakingContractInstance.methods.getStakingAndDaoAmount().call());
    }

    const claimDivs = async () => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            await ZARDStakingContractInstance.methods.claimDivs().send({
                from: account,
            })
            addNotification({
                message: `Transaction to claim Succeed!`,
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
                    message: 'Claim Failed.',
                    type: 'warning',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const deposit = async(amount) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await ZARDStakingContractInstance.methods.deposit(amount).send({
                from: account,
                // gasPrice
            })
            addNotification({
                title: 'Success',
                message: `Transaction to stake Succeed!`,
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
                    message: 'Stake Failed.',
                    type: 'warning',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }
    
    const withdraw = async(amount) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            // const gasPrice = await web3.eth.getGasPrice();
            await ZARDStakingContractInstance.methods.withdraw(amount).send({
                from: account,
                // gasPrice
            })
            addNotification({
                message: `Transaction to withdraw Succeed!`,
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
                    message: 'Withdraw Failed.',
                    type: 'warning',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    return {
        rewardRate,
        getPendingDivs,
        cliffTime,
        totalEarnedTokens,
        stakingTime,
        depositedTokens,
        lastClaimedTime,
        getNumberOfHolders,
        getStakingAndDaoAmount,
        deposit,
        withdraw,
        claimDivs
    };
}