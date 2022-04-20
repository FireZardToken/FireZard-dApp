import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Card, Container, Row, Col } from "react-bootstrap";
import AnnounceImage from '../../assets/images/announce.jpg';
import "./SummonAnnounceModal.css";

export default function SummonAnnounceModal() {
    const [showModal, setShowModal] = useState(true);
    
    return (
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
            keyboard={false}
            className="info-modal announce-modal"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>How To Summon</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card className="announce-card">
                    <Card.Body>
                        <img src={AnnounceImage} className="announce-img"/>
                    </Card.Body>
                </Card>
            </Modal.Body>
        </Modal>
    );
}