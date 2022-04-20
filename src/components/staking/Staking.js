import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import {
  useWeb3React
} from '@web3-react/core';
import BigNumber from "bignumber.js";

import "./Staking.css";
import babyFireZard from "../../assets/images/babyFireZard@1X.png";
import babyLectra_stickertesty from "../../assets/images/babyLectra_stickertesty@1X.png";
import fire from "../../assets/images/flameIcon@1X.png";
import Address from "../address";
import getFormattedNumber from "../../functions/get-formatted-number";
import { config } from "../../constances"
import ZARD from "../../constances/abis/zard_abi.json";
import ZARD_STAKING from "../../constances/abis/zard_staking_abi.json";
import useConnectHandler from "../../hooks/useConnectHandler";
import useZardContract from "../../hooks/useZardContract";
import useZARDStakingContract from "../../hooks/useZARDStakingContract";

const Staking = (props) => {
  const {
    account,
    library,
    chainId
  } = useWeb3React();
  const address = account;
  const { onConnectClick } = useConnectHandler();

  const { claimDivs, deposit, withdraw, rewardRate, getPendingDivs, cliffTime, totalEarnedTokens, stakingTime, depositedTokens, lastClaimedTime, getNumberOfHolders, getStakingAndDaoAmount } =
    useZARDStakingContract();

  const { approveZard, balanceOf, allowance: zardAllowance } = useZardContract();

  const [isApproved, setIsApproved] = useState(false)
  const [depositedAmount, setDepositedAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [canWithdraw, setCanWithdraw] = useState(true)
  const [fetchData, setState] = useState({
    apr: 0,
    zardBalance: '',
    pendingDivs: '',
    totalEarnedTokens: '',
    cliffTime: '',
    stakingTime: '',
    depositedTokens: '',
    lastClaimedTime: '',
    stakers: '',
    totalStaked: ''
  })

  useEffect(() => {
    if (account) {
      fetchDataFromBlockchain();
      const zard_refreshBalInterval = setInterval(fetchDataFromBlockchain, 3000)
      return () => clearInterval(zard_refreshBalInterval)
    } else {
      setState({
        apr: 0,
        zardBalance: '',
        pendingDivs: '',
        totalEarnedTokens: '',
        cliffTime: '',
        stakingTime: '',
        depositedTokens: '',
        lastClaimedTime: '',
        stakers: '',
        totalStaked: '',
      })
    }
  }, [account])

  const handleApproveZard = async () => {
    if (account) {
      const allowanceAmt = await zardAllowance(ZARD_STAKING.contractAddress);
      if (allowanceAmt == 0) {
        const tx = await approveZard(ZARD_STAKING.contractAddress, new BigNumber(1000000000000000000).times(1e18).toFixed(0))
        if (tx?.status == 1) {
          setIsApproved(true);
        }
      } else {
        setIsApproved(true);
      }
    }
  }

  const handleDeposit = async (e) => {
    e?.preventDefault()
    if (account && isApproved) {
      let amount = depositedAmount
      amount = new BigNumber(amount).times(1e18).toFixed(0)
      const tx = await deposit(amount)
      if (tx?.status == 1) {
        alertify.success(String('Transaction to stake Succeed!'))
      } else {
        throw new Error("User denied transaction signature.!")
      }
    }
  }

  const handleWithdraw = (e) => {
    e.preventDefault()
    if (account) {
      let amount = withdrawAmount
      amount = new BigNumber(amount).times(1e18).toFixed(0)
      withdraw(amount)
    }
  }

  const handleClaimDivs = (e) => {
    e.preventDefault()
    if (account) {
      claimDivs()
    }
  }

  const handleSetMaxDeposit = (e) => {
    e.preventDefault()
    setDepositedAmount(new BigNumber(fetchData.zardBalance).div(1e18).toFixed(18))
  }

  const handleSetMaxWithdraw = (e) => {
    e.preventDefault()
    setWithdrawAmount(new BigNumber(fetchData.depositedTokens).div(1e18).toFixed(18))
  }

  const fetchDataFromBlockchain = async () => {
    try {
      const fetchPromises = [
        (await rewardRate()) / 100,
        await balanceOf(account),
        await getPendingDivs(account),
        await cliffTime(),
        await totalEarnedTokens(account),
        await stakingTime(account),
        await depositedTokens(account),
        await lastClaimedTime(account),
        await getNumberOfHolders(),
        await getStakingAndDaoAmount(),
        await balanceOf(ZARD_STAKING.contractAddress),
        await zardAllowance(ZARD_STAKING.contractAddress)
      ];

      const [defaultAPR, _bal, _pDivs, _cliffTime, _tEarned, _stakingTime, _dTokens, _lClaimTime, _stakers, _stakingAndDaoAmount, _contractBalance, _allowance] = await Promise.all(fetchPromises);

      if (_allowance == 0)
        setIsApproved(false);
      else
        setIsApproved(true);

      let [zBalance, pDivs, cTime, tEarnedTokens, sTime, dTokens, lClaimTime, s, stakingAndDaoAmount, contractBalance] = [_bal, _pDivs, _cliffTime, _tEarned, _stakingTime, _dTokens, _lClaimTime, _stakers, _stakingAndDaoAmount, _contractBalance]

      let tStaked = (new BigNumber(contractBalance)).minus(stakingAndDaoAmount).toString(10)

      setState({
        apr: defaultAPR,
        zardBalance: zBalance,
        pendingDivs: pDivs,
        totalEarnedTokens: tEarnedTokens,
        cliffTime: cTime,
        stakingTime: sTime,
        depositedTokens: dTokens,
        lastClaimedTime: lClaimTime,
        stakers: s,
        totalStaked: tStaked,
      })
      cTime = cTime * 1e3
      sTime = sTime * 1e3

      setCanWithdraw(true)
      if (!isNaN(cTime) && !isNaN(sTime)) {
        if (Date.now() - sTime <= cTime)
          setCanWithdraw(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="staking-main">
      <div className="staking-main-content">
        <div className="content_header">
          <span className="text">staking</span>
        </div>
        <div className="content_body">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="staking-block left">
                  <img
                    src={babyFireZard}
                    className="header_icon"
                    alt="Baby Fire Zard"
                  />
                  <div className="staking-block_content">
                    <div className="staking-block_header">
                      STAKE $ZARD - EARN $FLAME
                    </div>
                    {account && isApproved == 1 ?
                      (<div>
                        <form onSubmit={handleDeposit}>
                          <div className="input_block mt-4">
                            <button className="lable" type='submit'>STAKE</button>
                            <div className="input-wrap">
                              <input value={depositedAmount} onChange={e => setDepositedAmount(e.target.value)} placeholder='0' className="input" />
                              <button className="btn-stake" onClick={handleSetMaxDeposit}>MAX</button>
                            </div>
                          </div>
                        </form>
                        <form onSubmit={handleWithdraw}>
                          <div className="input_block mt-2">
                            <button title={canWithdraw ? '' : 'You recently staked, please wait before unstaking.'} className="lable" disabled={!canWithdraw} type='submit' >
                              UNSTAKE
                            </button>
                            <div className="input-wrap">
                              <input value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder='0' type='text' className="input" />
                              <button className="btn-stake" onClick={handleSetMaxWithdraw}>MAX</button>
                            </div>
                          </div>
                          <div className="staking-block_info font-family-ddinblod">
                            5% fee if stake is withdrawn within 5 days
                          </div>
                        </form>
                      </div>) : (<div className="input-wrap mt-5">
                        <button onClick={handleApproveZard} className="approve-button">
                          ENABLE STAKING
                        </button>
                        <div className="staking-block_info font-family-ddinblod mt-2">
                          5% fee if stake is withdrawn within 5 days
                        </div>
                      </div>)
                    }

                    <form onSubmit={handleClaimDivs}>
                      <div className="input_block mt-2">
                        <button className="lable" type='submit'>CLAIM</button>
                        <span className="amount">{getFormattedNumber(new BigNumber(fetchData.pendingDivs).div(1e18).toString(10), 3)}</span>
                        <span className="info">
                          <img src={fire} className="fireIcon" alt="" />
                          <span>$FLAME</span>
                        </span>
                      </div>
                    </form>

                    <div className="button-wraper">
                      <button onClick={onConnectClick} className="connect-button font-family-ddinblod">
                        {account ? 'Wallet Info' : 'Connect Wallet'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="staking-block right">
                  <img
                    src={babyLectra_stickertesty}
                    className="header_icon"
                    alt="Baby Fire Zard"
                  />
                  <div className="staking-block_content">
                    <div className="staking-block_header">Your Data</div>
                    <div className="staking-block_list">
                      <ul className="staking-lists font-family-ddinblod">
                        <li className="staking-list">
                          <span>Wallet</span>{" "}
                          <div className="flex-1">
                            <Address a={address ? address : ''} />
                          </div>
                        </li>
                        <li className="staking-list">
                          <span>Contract</span>
                          <div className="flex-1">
                            <Address a={ZARD_STAKING.contractAddress} />
                          </div>
                        </li>
                        <li className="staking-list">
                          <span>My Balance</span>
                          <div className="flex-1">
                            <span className="amount mr-1">{getFormattedNumber(new BigNumber(fetchData.zardBalance).div(1e18).toString(10), 6)}</span>
                            <span className="info">$zard</span>
                          </div>
                        </li>
                        <li className="staking-list">
                          <span>Staked</span>{" "}
                          <div className="flex-1">
                            <span className="amount mr-1">{getFormattedNumber(new BigNumber(fetchData.depositedTokens).div(1e18).toString(10), 6)}</span>
                            <span className="info">$zard</span>
                          </div>
                        </li>
                        <li className="staking-list">
                          <span>Total Earned</span>
                          <div className="flex-1">
                            <span className="amount mr-1">{getFormattedNumber(new BigNumber(fetchData.totalEarnedTokens).div(1e18).toString(10), 6)}</span>
                            <span className="info">$flame</span>
                          </div>
                        </li>
                        <li className="staking-list">
                          <span>Pending</span>{" "}
                          <div className="flex-1">
                            <span className="amount mr-1">{getFormattedNumber(new BigNumber(fetchData.pendingDivs).div(1e18).toString(10), 6)}</span>
                            <span className="info">$flame</span>
                          </div>
                        </li>
                        <li className="staking-list tran-link">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${config.etherscan_baseURL}/token/${ZARD.contractAddress}?a=${account}`}
                          >
                            View Transaction History on Bscscan &nbsp;&nbsp;
                            <i
                              style={{ fontSize: ".7rem" }}
                              className="fas fa-external-link-alt"
                            ></i>
                          </a>
                        </li>
                        <li className="staking-list mt-5">
                          <span className="aprInfo">FLAME APR</span>{" "}
                          <div className="flex-1">
                            <span className="amount mr-1">{fetchData.apr}</span>
                            <span className="aprInfo">%</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Staking;
