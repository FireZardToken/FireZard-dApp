/* eslint-disable */
import React, { createContext } from 'react';

const FireZardUiContext = createContext({
  lastUpdatedTime: Date.now(),
  setLastUpdatedTime: () => {},
});

export default FireZardUiContext;
