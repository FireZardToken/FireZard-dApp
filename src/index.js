import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css'
import { configStore } from './configStore'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { Web3ReactProvider } from '@web3-react/core';
import { WalletContextProvider } from './context/WalletContext';
import { ClaimContextProvider } from './context/ClaimContext';

let history = createBrowserHistory({
  hashType: 'slash',
  getUserConfirmation: (message, callback) => callback(window.confirm(message))
});
const store = configStore(history);

const getLibrary = (provider) => {
  return provider;
};

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletContextProvider>
        <ClaimContextProvider>
          <Provider store={store}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </ClaimContextProvider>
      </WalletContextProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
