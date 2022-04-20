import "../staking/Staking.css";
import "./Summon.css";
import BabyRight from "../../assets/images/babyLectra_stickers.png"
import EggRight from "../../assets/images/Eeggs.png"
import SummonButton from "./SummonButton";

const SummonTenZard = (props) => {
    return (
        <div className="staking-block right">
            <img
                src={BabyRight}
                className="header_icon"
                alt="Baby Fire Zard"
            />
            <div className="staking-block_content summon_right">
                <span className="single">multi summon</span><br />
                <span className="single_small">draw ten random zards</span><br />
                <span className="single_very_small">one uncdmmon or above</span><br />
                <span className="single_very_small">guaranteed!</span><br />
                <img src={EggRight} alt="eggRight" className="eggRight" /><br />
                <span className="single_fire">10,000  FLAME</span><br />
                <span className="summon_warning">Please ensure you have at least 0.04 BNB for gas fees</span>
            </div>

            <SummonButton {...props} type="ten"/>
        </div>
    );
}
export default SummonTenZard;
