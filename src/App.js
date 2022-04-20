import React, { useState,  useEffect }  from "react";
import { Route, Redirect, Switch } from "react-router-dom"

import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import Staking from "./components/staking/Staking"
import Summon from "./components/summon/Summon"
import Items from "./components/items/Items";
import Zard from "./components/zards/Zard";
import Collection from "./components/collection/Collection";
import WalletModal from "./components/walletModal/WalletModal";

function App (props) {
  return (
    <div className="App">
      <WalletModal />
      <Header/>
      <div className="route-content">
         <Switch>
          <Route exact path="/">
            <Redirect to="/staking" />
          </Route>
          <Route exact path="/staking">
            <Staking />
          </Route>
          <Route exact path="/zard">
            <Zard />
          </Route>
          <Route exact path="/items">
            <Items />
          </Route>
          <Route exact path="/summon">
            <Summon />
          </Route>
          <Route exact path="/collection">
            <Collection />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
}


export default App;
