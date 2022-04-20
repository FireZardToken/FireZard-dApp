import React from "react";

import "../staking/Staking.css";
import "./Items.css";
import ComeSoon from "../../assets/images/come.png"

const Items = () => {

  return (
    <div className="Item-main">
        <div className="staking-main-content">
            <img src={ComeSoon} className="comeSoon" alt="Coming Soon" />
        </div>
    </div>
  );
}
export default Items;
