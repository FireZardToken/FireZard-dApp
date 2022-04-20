/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const ClaimContext = React.createContext({
    showClaimModal: false,
    setShowClaimModal: () => null,
    mintedTokenIDs: [],
    setMintedTokenIDs: () => null,
    type: '',
    setType: () => null,
    claimStatus: false,
    setClaimStatus: () => null,
    claimRefresh: false,
    setClaimRefresh: () => null,
});

const ClaimContextProvider = ({ children }) => {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [mintedTokenIDs, setMintedTokenIDs] = useState([]);
  const [type, setType] = useState([]);
  const [claimStatus, setClaimStatus] = useState(false);
  const [claimRefresh, setClaimRefresh] = useState(false);

  return (
    <ClaimContext.Provider value={{ showClaimModal, setShowClaimModal, mintedTokenIDs, setMintedTokenIDs, type, setType, claimStatus, setClaimStatus, claimRefresh, setClaimRefresh }}>
      {children}
    </ClaimContext.Provider>
  );
};

export { ClaimContext, ClaimContextProvider };
