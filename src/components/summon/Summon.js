import React, { useContext, useState, useEffect } from "react";

import 'alertifyjs/build/css/alertify.css';
import { keccak256 } from "@ethersproject/keccak256";
import {
  useWeb3React
} from '@web3-react/core';

import {
  getWeb3,
} from '../../utils';
import "../staking/Staking.css";
import "./Summon.css";

import ur from "../../assets/images/ur.png"
import sr from "../../assets/images/sr.png"
import r from "../../assets/images/r.png"
import u from "../../assets/images/u.png"
import c from "../../assets/images/c.png"

import useFlameContract from "../../hooks/useFlameContract";
import useNotification from "../../hooks/useNotification";
import useDragonMinterContract from "../../hooks/useDragonMinterContract";
import { ClaimContext } from "../../context/ClaimContext";
import NftTokenApi from "../../apis/nft.api";
import StateApi from "../../apis/state.api";

import ClaimModal from "../claimModal/ClaimModal";
import SummonAnnounceModal from "../summonAnnounceModal/SummonAnnounceModal";
import useBalance from "../../hooks/useBalance";
import SummonOneZard from "./SummonOneZard";
import SummonTenZard from "./SummonTenZard";


const Summon = (props) => {
  const {
    account,
    library,
    chainId
  } = useWeb3React();
  const web3 = getWeb3(library);

  // const account = '0x79d37104af99Ef827d3C6F02d9Cca8ffc687486D';

  const { ethBalance } = useBalance();
  const { balanceOf } = useFlameContract();
  const { getBlockConfirmationCap, initPackage, readPackage, openPackage, lockPackage } = useDragonMinterContract();
  const { setShowClaimModal, setMintedTokenIDs, setType, claimStatus, claimRefresh, type: claimType } = useContext(ClaimContext);
  const { addNotification } = useNotification();
  const [isMinting, setIsMinting] = useState(false);
  const [step, setStep] = useState(0);
  const [stepTen, setTenStep] = useState(0);

  useEffect(() => {
    StateApi.getStepStateData(account, 'one').then((res) => {
      console.log(res.data);
      if (res.data) {
        const { step: resStep, result: resResult } = res.data;
        console.log(resStep, resResult);
        if (resResult) setStep(resStep + 1);
        else setStep(resStep);
      } else {
        setStep(0);
      }
    })

    StateApi.getStepStateData(account, 'ten').then((res) => {
      if (res.data) {
        const { step: resStep, result: resResult } = res.data;
        if (resResult) setTenStep(resStep + 1);
        else setTenStep(resStep);
      } else {
        setTenStep(0);
      }
    })
  }, [account]);

  useEffect(
    () => {
      const claimHandler = async () => {
        if(claimRefresh){
          console.log("Passed here!");
          console.log("account: ", account, claimType);
          setStep(0);
        }
        else{
          if(claimType === "one" && claimStatus) setStep(4);
          if(claimType === "ten" && claimStatus) setTenStep(4);
          if(claimType === "one" && !claimStatus) setStep(3);
          if(claimType === "ten" && !claimStatus) setTenStep(3);
        }
      }
      claimHandler();
  }, [claimStatus, claimType, claimRefresh])

  const initialize = async (commitments, nonces, type) => {
    try {
      let size = 0; let burnTokenAmount = 0;
      if (!account) {
        addNotification({
          message: 'Please connect your wallet to BSC network.',
          type: 'warning',
        });

        return;
      }
      if (type === 'one') {
        size = 1;
        burnTokenAmount = 1500;
      } else if (type === 'ten') {
        if (ethBalance * 1.0 < 0.04) {
          addNotification({
            message: 'Please ensure you have at least 0.04 BNB for gas fees.',
            type: 'warning',
          });

          return;
        }

        size = 10;
        burnTokenAmount = 10000;
      }
      if (account) {
        const balance = await balanceOf(account);
        if (balance * 1.0 >= burnTokenAmount * 10 ** 18) {
          setIsMinting(true);
          await initPackage(commitments);
          await StateApi.setStateData({
            user: account,
            step: 0,
            state: JSON.stringify({ commitments, nonces }),
            result: 'success',
            type
          });
          setIsMinting(false);
          if (type === "one")
            setStep(1);
          else setTenStep(1);
          addNotification({
            message: 'Successfully package initialized.',
            type: 'success',
          });
        } else {
          addNotification({ message: String('Flame Balance is not enough!'), type: 'error' });
        }
      }
    } catch (e) {
      console.log(e.message);
      setIsMinting(false);
      await StateApi.setStateData({
        user: account,
        step: 0,
        state: JSON.stringify({ commitments, nonces }),
        result: 'fail',
        type
      });
      addNotification({
        message: e.message,
        type: 'error',
      });
      if (type === "one")
        setStep(0);
      else setTenStep(0);
    }

  }

  const lockSummonPackage = async (commitments, nonces, type) => {
    try {
      if (!account) {
        addNotification({
          message: 'Please connect your wallet to BSC network.',
          type: 'warning',
        });

        return;
      }
      if (account) {
        const nonceObj = nonces.map(nonce => Buffer.from(nonce));
        setIsMinting(true);
        await waitBeforeUnlock();
        await _lockPackageInternal(nonceObj);
        await StateApi.setStateData({
          user: account,
          step: 1,
          state: JSON.stringify({ commitments, nonces }),
          result: 'success',
          type
        });
        setIsMinting(false);
        if (type === "one")
          setStep(2);
        else setTenStep(2);
        addNotification({
          message: 'Successfully locked package.',
          type: 'success',
        });
      }
    } catch (e) {
      console.log(e.message);
      setIsMinting(false);
      await StateApi.setStateData({
        user: account,
        step: 1,
        state: JSON.stringify({ commitments, nonces }),
        result: 'fail',
        type
      });
      if (type === "one")
        setStep(1);
      else setTenStep(1);
      addNotification({
        message: e.message,
        type: 'error',
      });
    }
  }

  const _lockPackageInternal = async (nonces) => {
    let method = () => {
      return lockPackage(nonces);
    }
    return await sendLoop(method, 0);
  }

  const openSummonPackage = async (commitments, nonces, type) => {
    try {
      if (!account) {
        addNotification({
          message: 'Please connect your wallet to BSC network.',
          type: 'warning',
        });

        return;
      }
      if (account) {
        setIsMinting(true);
        await _openPackageInternal(commitments);
        await StateApi.setStateData({
          user: account,
          step: 2,
          state: JSON.stringify({ commitments, nonces }),
          result: 'success',
          type
        });
        setIsMinting(false);
        if (type === "one")
          setStep(3);
        else setTenStep(3);
        addNotification({
          message: 'Successfully opened package.',
          type: 'success',
        });
      }
    } catch (e) {
      console.log(e.message);
      setIsMinting(false);
      await StateApi.setStateData({
        user: account,
        step: 2,
        state: JSON.stringify({ commitments, nonces }),
        result: 'fail',
        type
      });
      if (type === "one")
        setStep(2);
      else setTenStep(3);
      addNotification({
        message: e.message,
        type: 'error',
      });
    }
  }

  const _openPackageInternal = async (commitments) => {
    let method = () => {
      return openPackage(account, commitments);
    }
    return await sendLoop(method, 0);
  }

  const claim = async (commitments, type) => {
    try {
      if (!account) {
        addNotification({
          message: 'Please connect your wallet to BSC network.',
          type: 'warning',
        });

        return;
      }
      if (account) {
        const mintedNFTIDs = await readPackage(commitments);
        await NftTokenApi.createNewCollection({ address: account, tokenIDs: mintedNFTIDs });
        setMintedTokenIDs(mintedNFTIDs);
        setType(type);
        setShowClaimModal(true);
        // if (type === "one")
        //   setStep(4);
        // else setTenStep(4);
      }
    } catch (e) {
      console.log(e.message);
      if (type === "one")
        setStep(3);
      else setTenStep(3);
    }
  }

  const sendLoop = (method, tries) => {
    return method().catch((err) => {
      console.error(err);
      if (tries > 10) throw Error("Failed after 10 tries. Giving up.");
      console.log(tries + ": retrying...");
      return sendLoop(method, tries + 1);
    });
  }

  const waitBeforeUnlock = async (minter) => {
    const start = await web3.eth.getBlockNumber();
    const confirmation_cap = await getBlockConfirmationCap();
    var current = start;
    //    console.log(current);
    do {
      await sleep(3000);
      current = await web3.eth.getBlockNumber();
      //	console.log(current);
    } while (current - start < confirmation_cap);
    //    console.log("DONE!");
  }

  const sleep = (time) => {
    return new Promise(res => setTimeout(res, time));
  }


  return (
    <>
      <SummonAnnounceModal />
      <ClaimModal />
      <div className="summon-main">
        <div className="staking-main-content">
          <div className="content_header">
            <span className="text">summon</span>
          </div>
          <div className="content_body">
            <div className="container">
              <div className="row">
                <div className="col-md-5 col-sm-12">
                  <SummonOneZard initialize={initialize} lockPackage={lockSummonPackage} openPackage={openSummonPackage} claim={claim} isMinting={isMinting} step={step} />
                </div>
                <div className="col-md-2 col-sm-12">
                  <div className="middle_div">
                    <span className="middle_text">ZARD POPULATION</span><br />
                    <span className="middle_text_per">PER</span><br />
                    <img src={ur} alt="ur" className="small_img" /> <span className="small_span">1</span><br />
                    <img src={sr} alt="sr" className="small_img" /> <span className="small_span">3</span><br />
                    <img src={r} alt="r" className="small_img" /> <span className="small_span">6</span><br />
                    <img src={u} alt="u" className="small_img" /> <span className="small_span">76</span><br />
                    <img src={c} alt="c" className="small_img" /> <span className="small_span">682</span><br />
                  </div>
                </div>
                <div className="col-md-5 col-sm-12">
                  <SummonTenZard initialize={initialize} lockPackage={lockSummonPackage} openPackage={openSummonPackage} claim={claim} isMinting={isMinting} step={stepTen} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Summon;
