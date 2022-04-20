import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";

import useNotification from "../../hooks/useNotification";
import useTreasuryContract from "../../hooks/useTreasuryContract";
import useDragonCardViewerContract from "../../hooks/useDragonCardViewerContract";
import { ClaimContext } from "../../context/ClaimContext";
import StateApi from "../../apis/state.api";
import "./ClaimModal.css";

export default function ClaimModal() {
    const {
        account,
      } = useWeb3React();

    const { showClaimModal, setShowClaimModal, mintedTokenIDs, type, setClaimStatus, setClaimRefresh } = useContext(ClaimContext);

    const [tokenDetails, setTokenDetails] = useState([]);
    const [totalRewards, setTotalRewards] = useState(0);

    const { claimRewardToken, getRewardValue } = useTreasuryContract();
    const { getView } = useDragonCardViewerContract();
    const {addNotification} = useNotification();

    useEffect(() => {
        updateTokensData(mintedTokenIDs);
    }, [mintedTokenIDs]);

    const updateTokensData = async (_mintedTokenIDs) => {
        let tokensData = [];
        let _totalRewards = 0;

        const statsPromises = [], rewardPromises = [];
        for(let i=0;i<_mintedTokenIDs.length;i++) {
            statsPromises.push(getView(_mintedTokenIDs[i]));
        }
        const stats = await Promise.all(statsPromises);

        for(let i=0;i< stats.length;i++) {
            rewardPromises.push(getRewardValue(stats[i].rarity));
        }
        const rewards = await Promise.all(rewardPromises);

        for(let i=0;i<rewards.length; i++) {
            _totalRewards = _totalRewards + rewards[i] * 1.0;
            tokensData.push({ id: _mintedTokenIDs[i], reward: (rewards[i]*1.0).toFixed(2), rarity: stats[i].rarity, card_type: stats[i].card_type, character: stats[i].character, character_name: stats[i].character_name });
        }
        // tokensData = tokensData.sort((a, b) => a.reward - b.reward);
        setTokenDetails(tokensData.sort((a, b) => b.rarity - a.rarity));
        setTotalRewards(_totalRewards);
    }

    const handleClaimRewards = async () => {
        try {
            const claimableTokens = tokenDetails.filter(tokenDetail => tokenDetail.reward*1.0 > 0);

            for(let i=0;i<claimableTokens.length;i++) {
                await claimRewardToken(claimableTokens[i].id);
            }

            setClaimStatus(true);
            setClaimRefresh(true);
            
            addNotification({type: 'success', message: `Successfully Claimed ${totalRewards} BNB`});
        } catch (error) {
            console.log(error.message);
            await StateApi.setStateData({
                user: account,
                step: 0,
                state: '',
                result: 'fail',
                type
            });
            addNotification({type: 'error', message: "Unable to claim at this time, please try again later"});
            setClaimStatus(false);
            setClaimRefresh(true);
        } finally {
            setShowClaimModal(false);
        }
    }

    return (
        <Modal
            show={showClaimModal}
            onHide={() => setShowClaimModal(false)}
            backdrop="static"
            keyboard={false}
            className="info-modal claim-modal"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>CLAIM</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card className="claim-card">
                    <Card.Body>
                        <Card.Title>You found new zards!</Card.Title>
                        <Container>
                            <Row>
                                {
                                    tokenDetails && tokenDetails.map((eachDetail, idx) => 
                                        <Col  key={idx}>
                                            <ZardCard data={eachDetail} key={idx}/>
                                        </Col>
                                    )
                                }
                            </Row>
                        </Container>


                        <Card.Text>
                            Click claim rewards to receive your win or try again!
                        </Card.Text>

                        <Container className="zard-info-container">
                            <Row className="text-left">
                                <Col><p>Zards Summoned</p></Col>
                                <Col><p>{mintedTokenIDs.length}</p></Col>
                            </Row>
                            <Row className="text-left">
                                <Col><p>earnings</p></Col>
                                <Col><p>{totalRewards} BNb</p></Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClaimRewards}>Claim Rewards</Button>
            </Modal.Footer>
        </Modal>
    );
}

const ZardCard = ({ data }) => {
    const [cardImgSrc, setCardImgSrc] = useState('');
  
    useEffect(() => {
      const cardTypes = [
        'Fire', 'Ice', 'Plant', 'Electric', 'Water'
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

      const cardImgName = cardImageSrcs[parseInt(data.card_type)].filter(name => name.includes(data.character) && name.includes(data.character_name));
      const cardImgSrc = require(`../../assets/images/dragons/${cardTypes[parseInt(data.card_type)]}/${cardImgName}.png`).default;
      setCardImgSrc(cardImgSrc);
    }, [data]);
    return (
        <Card className="zard-card">
            <Card.Img variant="top" src={cardImgSrc} />
            <Card.Body>
                <Card.Text>
                    {data.reward}
                </Card.Text>
            </Card.Body>
        </Card>
    );
  }