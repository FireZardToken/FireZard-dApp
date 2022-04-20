import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

import {
  connectorLocalStorageKey,
  ConnectorNames,
  WalletContext,
} from "../../context/WalletContext";
import METAMASK_ICON_URL from "../../assets/images/metamask.png";
import WALLETCONNECT_ICON_URL from "../../assets/images/walletConnectIcon.svg";
import CLOVER_ICON_URL from "../../assets/images/clover.svg";
import BSC_ICON_URL from "../../assets/images/bsc.jpg";
import styled from "styled-components";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import useBalance from "../../hooks/useBalance";
import FireZardUiContext from "../../context/FireZardUiContext";
import "./WalletModal.css";

const SUPPORTED_WALLETS = [
  {
    label: "MetaMask",
    icon: METAMASK_ICON_URL,
    connectorId: ConnectorNames.MetaMask,
    injected: true,
    description: "Connect to your MetaMask Wallet"
  },
  {
    label: "Binance",
    icon: BSC_ICON_URL,
    connectorId: ConnectorNames.BscConnector,
    injected: true,
    description: "Login using Binance hosted wallet"
  },
  {
    label: "Clover",
    icon: CLOVER_ICON_URL,
    connectorId: ConnectorNames.CloverConnect,
    injected: true,
    description: "Login using Clover hosted wallet"
  },
  {
    label: "WalletConnect",
    icon: WALLETCONNECT_ICON_URL,
    connectorId: ConnectorNames.WalletConnect,
    injected: false,
    description: "Scan with Wallet Connect to connect"
  }
];

const WalletCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  background-color: rgb(211 223 250);
  border: 1px solid #101535;

  &:hover {
    cursor: pointer;
    border: 1px solid white;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const AccountActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;

  a {
    color: white;
  }
`;

const CopyWrapper = styled.span`
  cursor: pointer;
`;

const ProviderOptions = () => {
  const { login } = useAuth();
  const { setShowWalletModal } = useContext(WalletContext);

  const wallets = SUPPORTED_WALLETS.filter((option) => {
    if (option.injected) {
      return window.ethereum ? true : false;
    }

    return true;
  });

  return (
    <>
      {wallets.map(({ label, icon, connectorId, description }) => {
        return (
          <WalletCard
            className="wallet-card"
            key={label}
            onClick={() => {
              login(connectorId);
              window.localStorage.setItem(
                connectorLocalStorageKey,
                connectorId
              );
              setShowWalletModal(false);
            }}
          >
            <div className="wallet-card-container">
              <div className="wallet-card-icon">
                <img src={icon} alt="option" />
              </div>
              <div className="wallet-card-name">
                {label}
              </div>
              <div className="wallet-card-description">
                {description}
              </div>
            </div>
            
          </WalletCard>
        );
      })}
    </>
  );
};

const AccountInformation = () => {
  const { account, chainId } = useWeb3React();
  const { addNotification } = useNotification();
  const { logout } = useAuth();
  const { setShowWalletModal } = useContext(WalletContext);
  const { lastUpdatedTime } = useContext(FireZardUiContext);

  const { ethBalance } = useBalance(lastUpdatedTime);
  return (
    <div className="account-modal-content">
      <div className="text-gray">
      {account}
      <CopyToClipboard
          text={account}
          onCopy={() => {
            addNotification({
              title: "",
              message: "Copied address to clipboard!",
              type: "success",
            });
          }}
        >
          <CopyWrapper>
            <i className="fas fa-paste" style={{ marginLeft: 8 }} />
          </CopyWrapper>
        </CopyToClipboard>
      </div>
      <AccountActions>
        <a
          style={{ color: "#3d3d48" }}
          target="_blank"
          rel="noreferrer noopener"
          href={`https://${
            chainId === 97 ? "testnet.bscscan.com" : "bscscan.com"
          }/address/${account}`}
        >
          <i
            className="fa fa-external-link"
            style={{ marginLeft: 24, marginRight: 8 }}
          />
          View on {chainId === 97 ? "testnet.bscscan.com" : "bscscan.com"}
        </a>
      </AccountActions>
      <br />
      <span className="text-gray">Your Balance : {(ethBalance * 1.0).toFixed(2)} BNB</span>
      <div style={{ textAlign: "center" }}>
        <Button
          variant="outline-success"
          type="button"
          style={{
            margin: "24px auto 0",
            color: "#464652",
            borderColor: "#464652",
          }}
          onClick={() => {
            logout();
            window.localStorage.removeItem(connectorLocalStorageKey);
            setShowWalletModal(false);
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default function WalletModal() {
  const { showWalletModal, setShowWalletModal } = useContext(WalletContext);
  const { account } = useWeb3React();

  return (
    <Modal
      show={showWalletModal}
      onHide={() => setShowWalletModal(false)}
      backdrop="static"
      keyboard={false}
      className="info-modal wallet-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{account ? "Your wallet" : "Connect Wallet"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!account && <ProviderOptions />}
        {account && <AccountInformation />}
      </Modal.Body>
    </Modal>
  );
}
