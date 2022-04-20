import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from 'react-redux'
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

import {
  useWeb3React
} from '@web3-react/core';
import BigNumber from "bignumber.js";

import "../staking/Staking.css";
import getFormattedNumber from "../../functions/get-formatted-number";
import Search from "../../assets/images/search.png"
import Rating from "../../assets/images/rating.png"
import C from "../../assets/images/c.png"
import U from "../../assets/images/u.png"
import R from "../../assets/images/r.png"
import SR from "../../assets/images/sr.png"
import UR from "../../assets/images/ur.png"
import Baby from "../../assets/images/babyZard@1X.png"
import Plus from "../../assets/images/plussymbol@1X.png"
import User from "../../assets/images/user.png"
import Ham from "../../assets/images/hamma.png"
import History from "../../assets/images/clock.png"
import Out from "../../assets/images/out.png"
import BNB from "../../assets/images/bnb.png"
import FireIcon from "../../assets/images/flameIcon.png";
import useBalance from "../../hooks/useBalance";
import useFlameContract from "../../hooks/useFlameContract";
import useDragonCardViewerContract from "../../hooks/useDragonCardViewerContract";
import useZARDNFTContract from "../../hooks/useZARDNFTContract";
import useTreasuryContract from "../../hooks/useTreasuryContract";
import useZardContract from "../../hooks/useZardContract";
import WalletApi from "../../apis/wallet.api";


const Collection = (props) => {
  const [flameBalance, setFlameBalance] = useState(0);
  const [zardBalance, setZardBalance] = useState(0);
  const [zardNFTBalance, setZardNFTBalance] = useState(0);
  const [totalNFTZard, setTotalNFTZard] = useState(0);
  const [mintedNFTs, setMintedNFTs] = useState(0);
  const [tokenDetails, setTokenDetails] = useState([]);
  const [tokenFilteredDetails, setTokenFilteredDetails] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [filterDate, setFilterDate] = useState('');
  const [filterRarityRank, setFilterRarityRank] = useState('');
  const { ethBalance } = useBalance();
  const {
    account,
    library,
    chainId
  } = useWeb3React();


  const { balanceOf: balanceOfNFT, totalSupply: totalSupplyNFT } = useZARDNFTContract();
  const { balanceOf: balanceOfFlame } = useFlameContract();
  const { balanceOf: balanceOfZard } = useZardContract();
  const { getView } = useDragonCardViewerContract();
  const { getRewardValue } = useTreasuryContract();

  const tokenArrSet = useMemo(() => {
    const arrSet = [];
    if (Array.isArray(tokenFilteredDetails)) {
      const dtArr = [...tokenFilteredDetails];
      while (dtArr.length > 0) {
        arrSet.push(dtArr.splice(0, 5));
      }
      return arrSet;
    }
    return [];
  }, [tokenFilteredDetails, filterDate, filterRarityRank]);

  useEffect(() => {
    if (account) {
      fetchDataFromBlockchain();
    } else {
      setFlameBalance(0);
      setZardNFTBalance(0);
      setTotalNFTZard(0);
      setZardBalance(0);
      setMintedNFTs([]);
    }
  }, [account])

  useEffect(() => {
    updateCollectionsData(mintedNFTs);
  }, [mintedNFTs]);

  const fetchDataFromBlockchain = async () => {
    try {
      const [zardNfttotalSupply, flameBalance, zardBalance, mintedNFTs] = await Promise.all([
        // balanceOfNFT(account),
        totalSupplyNFT(account),
        balanceOfFlame(account),
        balanceOfZard(account),
        // WalletApi.getCollections('0xDeA9a067CFC236515e86B43fa9EA1793921ba00F', 'owned')
        // WalletApi.getCollections('0x2f3b686576F5eb838414D7D27A6b8F2518Bfe7Ac', 'owned')
        WalletApi.getCollections(account, 'owned')
      ]);
      setFlameBalance(flameBalance);
      // setZardNFTBalance(zardNftBalance);
      setTotalNFTZard(zardNfttotalSupply);
      setZardBalance(zardBalance);
      // console.log("items============>", mintedNFTs)
      setMintedNFTs(mintedNFTs?.items)
    } catch (e) {
      console.error(e)
    }
  }

  const updateCollectionsData = useCallback(() => {
    _updateCollectionsData(mintedNFTs)
  }, [mintedNFTs])

  const _updateCollectionsData = async (_mintedTokenIDs) => {
    try {
      let tokensData = [];
      const getViewPromises = [], rewardPromises = [];
      
      for (let i = 0; i < _mintedTokenIDs.length; i++) {
        getViewPromises.push(
          getView(_mintedTokenIDs[i]?.tokenID)
        );
      }
      const allStats = await Promise.allSettled(getViewPromises);
      for (let i = 0; i < _mintedTokenIDs.length; i++) {
        const stats = allStats[i].value;
        if(stats !== undefined) {
          tokensData.push({ id: _mintedTokenIDs[i]?.tokenID, created: _mintedTokenIDs[i]?.date,  rarity: stats.rarity, card_type: stats.card_type, character: stats.character, character_name: stats.character_name, claimed: stats.card_claimed, reward: 0 });
          rewardPromises.push(getTokenRewardValue(_mintedTokenIDs[i]?.tokenID, stats.rarity));
        }
      }
      
      const rewards = await Promise.allSettled(rewardPromises);
      let _totalRewards = 0;
      for (let i = 0; i < rewards.length; i++) {
        _totalRewards = _totalRewards + rewards[i].value.reward * 1.0;
      }

      tokensData = tokensData.map((tokenData, index) => {
        return {...tokenData, reward: rewards[index].value.reward}
      }).sort((a, b) => a.rarity - b.rarity);

      setTotalRewards(_totalRewards);
      setTokenDetails(tokensData);
      setTokenFilteredDetails(tokensData);

      setZardNFTBalance(tokensData.length);
    } catch(e) {
      console.log(e)
    }
    
  }

  const getTokenRewardValue = async (tokenID, rarity) => {
    const reward = await getRewardValue(rarity);
    return {tokenID, reward};
  }

  const getCountZardTypes = () => {
    if (tokenDetails) {
      const cCount = tokenDetails.filter(token => token.rarity == 4).length;
      const uCount = tokenDetails.filter(token => token.rarity == 3).length;
      const rCount = tokenDetails.filter(token => token.rarity == 2).length;
      const srCount = tokenDetails.filter(token => token.rarity == 1).length;
      const urCount = tokenDetails.filter(token => token.rarity == 0).length;
      
      return [urCount, srCount, rCount, uCount, cCount];
    } else
      return [0, 0, 0, 0, 0];
  }

  const handleRarityFilter = (e) => {
    let _tokenFilteredDetails = [];
    const filterRarity = e.target.value;
    if (filterRarity == 'all') {
      _tokenFilteredDetails = tokenDetails;
    } else {
      _tokenFilteredDetails = tokenDetails.filter(token => token.rarity == filterRarity);
    }
    setTokenFilteredDetails(_tokenFilteredDetails)
  }
  
  const handleRarityRankFilter = (e) => {
    let _tokenFilteredDetails = tokenDetails;
    const filterRarity = e.target.value;
    if (filterRarity === 'low') {
      _tokenFilteredDetails.sort((a, b) => b.rarity - a.rarity);
    } else {
      _tokenFilteredDetails.sort((a, b) => a.rarity - b.rarity);
    }
    setTokenFilteredDetails(_tokenFilteredDetails)
    setFilterRarityRank(filterRarity)
  }

  const handleDateFilter = (e) => {
    let _tokenFilteredDetails = tokenDetails;
    const filterDate = e.target.value; 
    if (filterDate === 'new') {
      _tokenFilteredDetails.sort((a, b) =>  new Date(a.created).getTime() - new Date(b.created).getTime());
    } else {
      _tokenFilteredDetails.sort((a, b) =>  new Date(b.created).getTime() - new Date(a.created).getTime());
    }
    setTokenFilteredDetails(_tokenFilteredDetails)
    setFilterDate(filterDate)
  }

  const handleSearchInput = (e) => {
    let _tokenFilteredDetails = [];
    const filterInput = e.target.value;

    _tokenFilteredDetails = tokenDetails.filter(token => token.character_name.includes(filterInput) || token.character.includes(filterInput));

    setTokenFilteredDetails(_tokenFilteredDetails)
  }

  return (
    <div className="summon-main">
      <div className="row" style={{ width: 100 + "%" }}>
        <div className="col-md-3 leftDiv">
          <div className="filterSetting">
            <p className="filterResult">your profile</p>
            <p className="filterType">
              <img src={User} className="userAvatar" alt="User" />
              My Account
            </p>
            <p className="filterType">
              <img src={Ham} className="userAvatar" alt="Ham" />
              For Sale
            </p>
            <p className="filterType">
              <img src={History} className="userAvatar" alt="History" />
              History
            </p>
            <div className="userData">
              <div className="Address">
                Address: {account ? account.slice(0, 8) + '...' + account.slice(account.length - 8) : ''}
                <img src={Out} className="Out" alt="Out Address" />
              </div>
              <div className="Address Reward">
                your rewards
                <p className="yourBNB">{totalRewards.toFixed(2)} BNB</p>
              </div>
              <div className="filterSelect">
                <div className="line1">
                  <img src={C} className="fireNone RarityIMG" alt="C" />
                  <p className="Num1">{getCountZardTypes()[4]}</p>
                  <p className="Num2">{getCountZardTypes()[3]}</p>
                  <img src={U} className="water RarityIMG" alt="U" />

                </div>
                <div className="line2">
                  <img src={R} className="fireNone RarityIMG" alt="R" />
                  <p className="Num1">{getCountZardTypes()[2]}</p>
                  <p className="Num2">{getCountZardTypes()[1]}</p>
                  <img src={SR} className="water RarityIMG" alt="SR" />
                </div>
                <div className="line3">
                  <img src={UR} className="fireNone RarityIMG" alt="UR" />
                  <p className="Num1">{getCountZardTypes()[0]}</p>
                </div>
              </div>
              <div></div>
              <div className="row Address Reward rowReward">
                your balance
                {/* <p className="yourBNB rowBNB">29.8 BNB</p> */}
              </div>
              <div className="smart">
                <img src={FireIcon} className="fireNone RarityIMG RatingIMG" alt="Fire Balance" />
                {getFormattedNumber(new BigNumber(flameBalance).div(1e18).toString(10), 6)}
                {/* <p className="yourBNB">$1037.10</p> */}
              </div>
              <div className="smart">
                <img src={Rating} className="fireNone RarityIMG RatingIMG" alt="Rating" />
                {getFormattedNumber(new BigNumber(zardBalance).div(1e18).toString(10), 6)}
                {/* <p className="yourBNB">$1037.10</p> */}
              </div>
              <div className="smart">
                <img src={BNB} className="fireNone RarityIMG RatingIMG" alt="BNB" />
                {ethBalance.toFixed(2)}
                {/* <p className="yourBNB">$13,230.60</p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9 rightDiv">
          <div className="nfts">
            <div className="nfts_text">nfts collected</div>
            <div className="nfts_zard">
              <img src={Baby} className="Baby" alt="NFTs Baby" />
              <div className="Zard">
                <p>{zardNFTBalance}</p>
                <p className="zard_text">zards</p>
              </div>
            </div>
            {/* <div className="nfts_item">
              <img src={Plus} className="Baby" alt="NFTs Plus" />
              <div className="Zard">
                <p>{zardNFTBalance}</p>
                <p className="zard_text">items</p>
              </div>
            </div> */}
          </div>
          <div className="RightHeads">
            <p className="result_amount">Rarity</p>
            <div className="LSelect">
              <select className="form-select selectname" arial-label="Default select example" onChange={(e) => handleRarityFilter(e)}>
                <option value="all" selected>All</option>
                <option value="0">UR</option>
                <option value="1">SR</option>
                <option value="2">R</option>
                <option value="3">U</option>
                <option value="4">C</option>
              </select>
            </div>
            <div className="LSelect">
              <select className="form-select selectname" arial-label="Default select example" onChange={(e) => handleRarityRankFilter(e)}>
                <option value="">Select one</option>
                <option value="high">Highest</option>
                <option value="low">Lowest</option>
              </select>
            </div>

            <div className="RSelect">
              <select className="form-select selectname" arial-label="Default select example" onChange={(e) => handleDateFilter(e)}>
                <option selected>Date Obtained</option>
                <option value="new">Latest</option>
                <option value="old">Oldest</option>
              </select>
            </div>

            <div className="RSearch">
              <div className="search_box">
                <img src={Search} className="searchIMG" alt="search" />
                <input className="searchInput" placeholder="Search by ID or Name" onChange={(e) => handleSearchInput(e)} />
              </div>
            </div>
          </div>
          {
            tokenArrSet.map((dtSet, index) =>
              <div className="RightMain" key={index}>
                {
                  dtSet.map((eachToken, idx) => <ZardCard key={idx} data={eachToken} />)
                }
              </div>
            )
          }

        </div>
      </div>
    </div>
  );
}

const ZardCard = ({ data }) => {
  const [cardTypeImg, setCardTypeImg] = useState('');
  const [cardImgSrc, setCardImgSrc] = useState('');
  const [cardType, setCardType] = useState('');

  useEffect(() => {
    const cardTypes = [
      'Fire', 'Ice', 'Plant', 'Electric', 'Water'
    ];

    const cardTypeImgSrc = [
      '/fireNone.png',
      '/snow.png',
      '/tree.png',
      '/elec.png',
      '/water.png',
    ];

    const cardImageSrcs = [
      ['_000_FireZard-UR', '_001_FireZard-SR', '_002_FlaroZard', '_003_FlaroZard2', '_004_FlaroZard3', '_005_EmberZard',
        '_006_EmberZard2', '_007_EmberZard3', '_008_Flamebryo', '_009_Flamebryo2', '_010_Flamebryo3', '_011_Flamebryo4',
        '_012_Flamebryo5'],
      ['_013_BliZard-UR', '_014_BliZard-SR', '_015_FroZard', '_016_FroZard3', '_017_FroZard2', '_018_ChillaZard',
        '_019_ChillaZard2', '_020_ChillaZard3', '_021_Coolbryo', '_022_Coolbryo2', '_023_Coolbryo3', '_024_Coolbryo4',
        '_025_Coolbryo5'],
      ['_026_FloraZard-UR', '_027_FloraZard-SR', '_028_BlosZard2', '_029_BlosZard3', '_030_BlosZard', '_031_SproutyZard2',
        '_032_SproutyZard3', '_033_SproutyZard', '_034_Seedbryo', '_035_Seedbryo2', '_036_Seedbryo3', '_037_Seedbryo4',
        '_038_Seedbryo5'],
      ['_039_LectraZard-UR', '_040_LectraZard-SR', '_041_VolZard', '_042_VolZard2', '_043_VolZard3', '_044_SparkyZard3',
        '_045_SparkyZard', '_046_SparkyZard2', '_047_Zapbryo', '_048_Zapbryo2', '_049_Zapbryo3', '_050_Zapbryo4', '_051_Zapbryo5'],
      ['_052_HydraZard-UR', '_053_HydraZard-SR', '_054_AqaZard', '_055_AqaZard2', '_056_AqaZard3', '_057_DriplaZard2',
        '_058_DriplaZard3', '_059_DriplaZard', '_060_Splashbryo', '_061_Splashbryo2', '_062_Splashbryo3', '_063_Splashbryo4'
        , '_064_Splashbryo5']
    ];

    const cardImgName = cardImageSrcs[parseInt(data.card_type)].filter(
      name => {
        const character = data.character.toString().length === 1 ? `00${data.character}` : `0${data.character}`;
        return name.includes(data.character_name) && name.includes(character)
      }
      );
    const cardTypeImg = require('../../assets/images' + `${cardTypeImgSrc[parseInt(data.card_type)]}`).default;
    const cardImgSrc = require('../../assets/images/dragons/' + `${cardTypes[parseInt(data.card_type)]}/${cardImgName}.png`).default;
    setCardTypeImg(cardTypeImg);
    setCardImgSrc(cardImgSrc);
    setCardType(cardTypes[parseInt(data.card_type)])
  }, [data]);
  return (
    <div className="eachDiv">
      <div>
        <div className="itemID">#{data.character}</div>
        <img src={cardTypeImg} className="elect" alt={cardType} />
      </div>
      <img src={cardImgSrc} className="oneIMG" alt="one" />
      <p className="price1">Reward: {data.reward}</p>
      {
        data.reward > 0 && <p className="price2">{data.claimed? 'Claimed': 'Not Claimed'}</p>
      }
      {/* <div className="ratingDiv">
        <img src={Rating} className="ratingIMG" alt="rating" />
        <p className="price1">920.4K</p>
        <p className="price2">$537.10</p>
      </div> */}
    </div>
  );
}

export default Collection;
