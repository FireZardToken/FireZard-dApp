import { useCallback } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector';
import useNotification from './useNotification';
import { connectorLocalStorageKey, connectorsByName } from '../context/WalletContext';

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const { addNotification } = useNotification();

  const login = useCallback((connectorID) => {
    const connector = connectorsByName[connectorID];

    if (connector) {
      activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          addNotification({
            message: 'Please check if BSC main or BSC test network is chosen.',
            type: 'warning',
          });
          activate(connector);
        } else {
          window.localStorage.removeItem(connectorLocalStorageKey);
          if (error instanceof NoEthereumProviderError) {
            addNotification({
              message: 'No provider was found',
              type: 'warning',
            });
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector;
              walletConnector.walletConnectProvider = null;
            }
            addNotification({
              message: 'Please authorize to access your account',
              type: 'warning',
            });
          } else {
            addNotification({
              title: error.name,
              message: error.message,
              type: 'warning',
            });
          }
        }
      });
    } else {
      addNotification({
        message: 'The connector config is wrong',
        type: 'warning',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { login, logout: deactivate };
};

export default useAuth;
