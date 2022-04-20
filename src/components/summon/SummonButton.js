import { useContext, useEffect, useState } from "react";
import {
    useWeb3React
} from '@web3-react/core';
import { keccak256 } from "@ethersproject/keccak256";
import StateApi from "../../apis/state.api";
import useConnectHandler from "../../hooks/useConnectHandler";
import { ClaimContext } from "../../context/ClaimContext";


const SummonButton = (props) => {
    const {
        account,
    } = useWeb3React();
    const { onConnectClick } = useConnectHandler();

    const {initialize, lockPackage, openPackage, claim, isMinting, type, step} = props;
    const [initialSummonState, setInitialSummonState] = useState({step, result: null, state: null})
    const [config, setConfig] = useState({nonces: null, commitments: null});
    const {claimStatus, type:ClaimType} = useContext(ClaimContext);

    const getConfig = (type) => {
        var nonces = [];
        var commitments = [];
        const size = type === "one" ? 1 : 10;
        if (typeof size === 'undefined')
            size = 1;
        // Generating (pseudo-)random numbers (nonces) and their hashes on client side
        for (var i = 0; i < size; i++) {
            nonces[i] = generateNonce();
            commitments[i] = keccak256('0x' + nonces[i].toString('hex'));
        }

        return {nonces: nonces, commitments: commitments}
    }

    const generateNonce = () => {
        return hash(Math.floor(Math.random() * (10 ** 12)));
    }

    const hash = (nonce) => {
        return Buffer.from(keccak256(toHex(nonce)).replace('0x', ''), 'hex');
    }

    const toHex = (num) => {
        var hexS = num.toString(16);
        const length = 32;

        while (hexS.length < length) hexS = '0' + hexS;
        return '0x' + hexS;
    }

    useEffect(() => {
        if(step === 0) {
            setConfig(getConfig(type));
        }

        if(step !== 0) {
            StateApi.getStateData(account, type, step-1).then((res) => {
                console.log("step > 0", res);
                if (res.data) {
                    
                    setInitialSummonState({ step: res.data.step, result: res.data.result, state: res.data.state });
                } else {
                    StateApi.getStateData(account, type, step).then((res1) => {
                        if (res1.data) {
                            console.log(res1.data)
                            setInitialSummonState({ step: res1.data.step, result: res1.data.result, state: res1.data.state });
                        } else {
                            setInitialSummonState({ step, result: null, state: null });
                        }
                    })
                }
            })
        }
        console.log("initial: ", initialSummonState, step, initialSummonState.result);
    }, [account, step, type]);

    return (
        <>
            {!account && <button className="button" onClick={onConnectClick}>
                    <span>Connect Wallet</span>
                </button>}
            {
                account && initialSummonState.step === 0 && step === 0 && !initialSummonState.result && 
                <button className="button" onClick={() => initialize(config.commitments, config.nonces, type)} disabled={isMinting}>
                    <span className="stepNum">STEP 1</span><br/>
                    <span>SUMMON {type==="one"? '1 ZARD': '10 ZARDS'} (Initialize)</span>
                </button>
            }
            {
                account && initialSummonState.step === 0 && step === 1 && initialSummonState.result && 
                <button className="button" onClick={() => lockPackage(JSON.parse(initialSummonState.state).commitments, JSON.parse(initialSummonState.state).nonces, type)} disabled={isMinting}>
                    <span className="stepNum">STEP 2</span><br/>
                    <span>SUMMON {type==="one"? '1 ZARD': '10 ZARDS'} (Lock Package)</span>
                </button>
            }
            {
                account && initialSummonState.step === 1 && step === 1 && !initialSummonState.result && 
                <button className="button" onClick={() => lockPackage(JSON.parse(initialSummonState.state).commitments, JSON.parse(initialSummonState.state).nonces, type)} disabled={isMinting}>
                    <span className="stepNum">STEP 2</span><br/>
                    <span>SUMMON {type==="one"? '1 ZARD': '10 ZARDS'} (Lock Package)</span>
                </button>
            }
            {
                account && initialSummonState.step === 1 && step === 2 && initialSummonState.result && 
                <button className="button" onClick={() => openPackage(JSON.parse(initialSummonState.state).commitments, JSON.parse(initialSummonState.state).nonces, type)} disabled={isMinting}>
                    <span className="stepNum">STEP 3</span><br/>
                    <span>SUMMON {type==="one"? '1 ZARD': '10 ZARDS'} (Open Package)</span>
                </button>
            }
            {
                account && initialSummonState.step === 2 && step === 2 && !initialSummonState.result && 
                <button className="button" onClick={() => openPackage(JSON.parse(initialSummonState.state).commitments, JSON.parse(initialSummonState.state).nonces, type)} disabled={isMinting}>
                    <span className="stepNum">STEP 3</span><br/>
                    <span>SUMMON {type==="one"? '1 ZARD': '10 ZARDS'} (Open Package)</span>
                </button>
            }
            {
                account && initialSummonState.step === 2 && step === 3 && initialSummonState.result && 
                <button className="button" onClick={() => claim(JSON.parse(initialSummonState.state).commitments, type)} disabled={isMinting}>
                    <span className="stepNum">STEP 4</span><br/>
                    <span>SUMMON {type==="one"? '1 ZARD': '10 ZARDS'} (Claim Rewards)</span>
                </button>
            }
            {
                account && initialSummonState.step === 3 && step === 3 && !initialSummonState.result && 
                <button className="button" onClick={() => claim(JSON.parse(initialSummonState.state).commitments, type)} disabled={isMinting}>
                    <span className="stepNum">STEP 4</span><br/>
                    <span>SUMMON {type==="one"? '1 ZARD': '10 ZARDS'} (Claim Rewards)</span>
                </button>
            }
            {
                account && initialSummonState.step === 3 && step === 4 && initialSummonState.result &&
                <button className="button" onClick={() => initialize(config.commitments, config.nonces, type)} disabled={isMinting}>
                    <span className="stepNum">STEP 1</span><br/>
                    <span>SUMMON {type==="one"? '1 ZARD': '10 ZARDS'} (Initialize)</span>
                </button>
            }
        </>
    )
}

export default SummonButton;