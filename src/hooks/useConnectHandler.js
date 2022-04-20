import { useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import useNotification from './useNotification';
import { WalletContext } from '../context/WalletContext';

export default function useConnectHandler() {
  const { chainId } = useWeb3React();
  const { addNotification } = useNotification();
  const { setShowWalletModal } = useContext(WalletContext);

  //toggles the wallet modal
  const onConnect = () => {
    setShowWalletModal(true);
  };

  const chainSupported = (chainId === 56 || chainId === 97);

  const onConnectClick = () => {
    if (chainId && !chainSupported) {
      addNotification({
        message: `Please check if Ethereum main or ropsten network is chosen.`,
        type: 'warning',
      });
    }

    onConnect();
  };

  return { onConnectClick };
}
