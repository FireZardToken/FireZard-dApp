import React from "react";
import "./Footer.css";
import social from "../../assets/images/social.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  return (
    <footer className="footer-block">
      <div className="row footer-wraper font-family-ddinblod no-gutters">
        <div className="item-1 col-md-5 col-sm-12">
          <ul className="footer-ul text-center">
            <li className="footer-li">
              <a href="https://firezard.com">
                <img className="logo" src="../../logo192.png" alt="logo" />
              </a>
            </li>
            <li className="footer-li mt-4 mt-sm-0 pt-2">
              <a href="#">Terms of service</a>
            </li>
            <li className="footer-li pt-4">
              <a href="#">Privacy policy</a>
            </li>
          </ul>
        </div>
        <div className="item-2 col-md-1 col-6">
          <ul className="footer-ul">
            <li className="footer-li">
              <a href="/">Home Page</a>
            </li>
            <li className="footer-li">
              <a href="/staking">Staking</a>
            </li>
            <li className="footer-li">
              <a href="/summon">Summon</a>
            </li>
            <li className="footer-li">
              <a href="#">Marketplace</a>
            </li>
            <li className="footer-li">
              <a href="/collection">Collection</a>
            </li>
            <li className="footer-li">
              <a href="/items">Items</a>
            </li>
          </ul>
        </div>
        <div className="item-3 col-md-1 col-6">
          <ul className="footer-ul">
            <li className="footer-li">
              <a href="">Resources</a>
            </li>
            <li className="footer-li">
              <a href="https://firezard.gitbook.io/firezard">Whitepaper</a>
            </li>
            <li className="footer-li">
              <a href="https://audit.solidgrp.io/audits/firezard">Audit</a>
            </li>
            <li className="footer-li">
              <a href="https://pancakeswap.finance/swap?outputCurrency=0xcF663a0ef9155BdC35a4B918BbEC75E9bFE40D2a">Buy ZARD</a>
            </li>
          </ul>
        </div>
        <div className="item-4 col-md-5 col-sm-12">
          <ul className="footer-ul text-center">
            <li className="footer-li">Social</li>
            <li className="footer-li pt-4 mt-3">
              <div className="social-icon">
                <a href="https://t.me/firezard">
                  <i className="fab fa-telegram-plane"></i>
                </a>
                <a href="https://twitter.com/firezardtcg">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.instagram.com/firezardtcg">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://firezard.gitbook.io/firezard">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://medium.com/@FireZard">
                  <i className="fab fa-medium"></i>
                </a>
                <a href="https://www.youtube.com/channel/UCiFjeyNZyp9ZeTKW-qNLY9Q">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://www.reddit.com/r/FireZard">
                  <i className="fab fa-reddit-alien"></i>
                </a>
              </div>
            </li>
            <li className="footer-li">
            dApp Version: 1.0.2
            </li>
          </ul>
          <br/>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
