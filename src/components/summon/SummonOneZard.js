import "../staking/Staking.css";
import "./Summon.css";
import BabyLeft from "../../assets/images/babyHydra_sticker.png"
import EggLeft from "../../assets/images/Eegg.png"

import SummonButton from "./SummonButton";


const SummonOneZard = (props) => {
    return (
        <div className="staking-block left">
            <img
                src={BabyLeft}
                className="header_icon"
                alt="Baby Fire Zard"
            />
            <div className="staking-block_content summon_left">
                <span className="single single_left">single summon</span><br />
                <span className="single_small">draw one random zard</span><br />
                <img src={EggLeft} alt="eggLeft" className="eggLeft" /><br />
                <span className="single_fire">1500  FLAME</span><br />
            </div>

            <SummonButton {...props} type="one"/>
        </div>
    );
}
export default SummonOneZard;
