/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { getNodeUrl, getTestNodeUrl } from './getNodeUrl';
import { CloverConnector } from '@clover-network/clover-connector';
import { BscConnector } from '@binance-chain/bsc-connector';

const WalletContext = React.createContext({
  showWalletModal: false,
  setShowWalletModal: () => null,
});

const WalletContextProvider = ({ children }) => {
  const [showWalletModal, setShowWalletModal] = useState(false);

  return (
    <WalletContext.Provider value={{ showWalletModal, setShowWalletModal }}>
      {children}
    </WalletContext.Provider>
  );
};

export const connectorLocalStorageKey = 'connectorIdForFireZard';
export const ConnectorNames = {
  MetaMask: 'MetaMask',
  BscConnector: 'Binance',
  WalletConnect: 'WalletConnect',
  CloverConnect: 'Clover'
};

const injected = new InjectedConnector({ supportedChainIds: [56, 97] });
const rpcUrl = getNodeUrl();
const testRpcUrl = getTestNodeUrl();
const walletconnect = new WalletConnectConnector({
  infuraId: '',
  rpc: { 56: rpcUrl, 97: testRpcUrl },
  supportedChainIds: [56, 97],
});

const bscConnector = new BscConnector({
  supportedChainIds: [56, 97],
})

const cloverConnector = new CloverConnector({
  supportedChainIds: [56, 97],
})

export const connectorsByName = {
  [ConnectorNames.MetaMask]: injected,
  [ConnectorNames.CloverConnect]: cloverConnector,
  [ConnectorNames.BscConnector]: bscConnector,
  [ConnectorNames.WalletConnect]: walletconnect,
};

export { WalletContext, WalletContextProvider };
