import React, { useState } from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";
import wallet from "../../assets/images/shutterstock_walet.png";
import fire from "../../assets/images/flameIcon@1X.png";
import babyZard from "../../assets/images/babyZard@1X.png";
import plusSymbol from "../../assets/images/plussymbol@1X.png";
import summon from "../../assets/images/summon@1X.png";
import FireZardCard from "../../assets/images/FireZardCard@1X.png";
import useConnectHandler from "../../hooks/useConnectHandler";
import {
  useWeb3React
} from '@web3-react/core';

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { onConnectClick } = useConnectHandler();
  const openMenu = () => {
    setMenuOpen(true);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };
  const mobileMenuRender = (e) => { };
  const handleConnection = () => {
    closeMenu()
    onConnectClick();
  }

  const {
    account,
    library,
    chainId
  } = useWeb3React();
  const address = account;


  return (
    <header className="header">
      <div className="row">
        <div className="col-md-3 col-sm-10 col-logo">
          <a href="https://firezard.com">
            <img className="logo" src="../../logo192.png" alt="logo" />
          </a>
          <div className="flex-1 mobile-menu-icon">
            <i className="fas fa-bars" onClick={openMenu}></i>
          </div>
        </div>
        <div className="col-md-7 col-sm-12 col-menu-item">
          <div className="menu-item ">
            <div className="img">
              <img src={fire} alt="fire" />
            </div>
            <NavLink to="/staking" className="text" activeClassName="active">
              staking
            </NavLink>
          </div>
          <div className="menu-item">
            <div className="img">
              <img src={babyZard} alt="Baby Zard" />
            </div>
            <NavLink to="/zard" className="text" activeClassName="active">
              zards
            </NavLink>
          </div>
          <div className="menu-item">
            <div className="img">
              <img src={plusSymbol} alt="Plus Symbol" />
            </div>
            <NavLink to="/items" className="text" activeClassName="active">
              items
            </NavLink>
          </div>
          <div className="menu-item">
            <div className="img">
              <img src={summon} alt="Summon" />
            </div>
            <NavLink to="/summon" className="text" activeClassName="active">
              summon
            </NavLink>
          </div>
          <div className="menu-item">
            <div className="img">
              <img src={FireZardCard} alt="Fire Zard Card" />
            </div>
            <NavLink to="/collection" className="text" activeClassName="active">
              collection
            </NavLink>
          </div>
        </div>
        <NavLink to='#' className="col-md-2 col-sm-12 col-wallet" onClick={handleConnection}>
          <div className="wallet-wraper">
            <img className="wallet" src={wallet} alt="wallet" />
            <div className="wallet-text-wrap font-family-ddinblod">
              <span className="wallet-text">{account?'Wallet Info': 'Connect Wallet'}</span>
            </div>
          </div>
        </NavLink>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
          <div className="menu-header">
            <div className="close-wrap" onClick={closeMenu}>
              <i className="fas fa-times"></i>
            </div>
          </div>
          <ul className="mobile-menu-ul">
            <li className="mobile-menu-items">
              <NavLink
                to="/staking"
                className="mobile-text"
                activeClassName="active"
                onClick={closeMenu}
              >
                staking
              </NavLink>
            </li>
            <li className="mobile-menu-items">
              <NavLink
                to="/zard"
                className="mobile-text"
                activeClassName="active"
                onClick={closeMenu}
              >
                zards
              </NavLink>
            </li>
            <li className="mobile-menu-items">
              <NavLink
                to="/items"
                className="mobile-text"
                activeClassName="active"
                onClick={closeMenu}
              >
                items
              </NavLink>
            </li>
            <li className="mobile-menu-items">
              <NavLink
                to="/summon"
                className="mobile-text"
                activeClassName="active"
                onClick={closeMenu}
              >
                summon
              </NavLink>
            </li>
            <li className="mobile-menu-items">
              <NavLink
                to="/collection"
                className="mobile-text"
                activeClassName="active"
                onClick={closeMenu}
              >
                collection
              </NavLink>
            </li>
            <li className="mobile-menu-items connect-wallet">
              <button onClick={handleConnection} className="connect-wallet-text">
                {account?'Wallet Info': 'Connect Wallet'}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
