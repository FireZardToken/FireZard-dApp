import {
    useRef,
    useState,
    useEffect,
    useMemo
} from 'react';
import {
    useWeb3React
} from '@web3-react/core';

import {
    BNtoNumber,
    getWeb3,
} from '../utils';


const FETCH_INTERVAL = 500;

export default function useBalance(lastUpdatedTime) {
    const handler = useRef(null);
    const [ethBalance, setEthBalance] = useState(0);
    
    const {
        account,
        library,
        chainId
    } = useWeb3React();
    const address = account;
    const web3 = getWeb3(library);

    useEffect(() => {
        async function getBalance() {
            const promises = [];

            if (address && (chainId === 56 || chainId === 97)) {
                promises.push(
                    web3.eth.getBalance(address),
                );
            } else {
                promises.push(0)
            }

            const [ethBal] = await Promise.all(promises);
            setEthBalance(Number(BNtoNumber(ethBal.toString(), 1e18)));
        }

        handler.current = setInterval(() => {
            getBalance();
        }, FETCH_INTERVAL);

        return () => {
            if (handler.current) {
                clearInterval(handler.current);
            }
        };
}, [web3, address, chainId, lastUpdatedTime]);

    return {
        ethBalance,
    };
}
