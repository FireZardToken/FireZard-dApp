import React from "react";
import "./Zard.css";
import Checkbox from "@material-ui/core/Checkbox";

import Search from "../../assets/images/search.png"
import Elect from "../../assets/images/elec.png"
import One from "../../assets/images/one.png"
import Rating from "../../assets/images/rating.png"
import Two from "../../assets/images/two.png"
import Three from "../../assets/images/three.png"
import Four from "../../assets/images/four.png"
import Five from "../../assets/images/five.png"
import Water from "../../assets/images/water.png"
import FireNone from "../../assets/images/fireNone.png"
import Snow from "../../assets/images/snow.png"
import Tree from "../../assets/images/tree.png"
import C from "../../assets/images/c.png"
import U from "../../assets/images/u.png"
import R from "../../assets/images/r.png"
import SR from "../../assets/images/sr.png"
import UR from "../../assets/images/ur.png"
import ComeSoon from "../../assets/images/come.png"

const Zard = () => {

  return (
      <div className="summon-main">
          {/* <div className="row" style={{width:100+"%"}}>
            <div className="col-md-3 leftDiv">
                <div className="filterSetting">
                    <p className="filterResult">filter (0)</p>
                    <p className="filterType">Type</p>
                    <div className="filterSelect">
                        <div className="line1">
                            <Checkbox className="checkBox" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                            <img src={FireNone} className="fireNone" alt="fireNone" />
                            <img src={Water} className="water" alt="water" />
                            <Checkbox className="checkBox1" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                        </div>
                        <div className="line2">
                            <Checkbox className="checkBox" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                            <img src={Snow} className="fireNone" alt="Snow" />
                            <img src={Tree} className="water" alt="Tree" />
                            <Checkbox className="checkBox1" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                        </div>
                        <div className="line3">
                            <Checkbox className="checkBox" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                            <img src={Elect} className="fireNone" alt="Elect" />
                        </div>
                    </div>
                    <p className="filterType Rarity">Rarity</p>
                    <div className="filterSelect">
                        <div className="line1">
                            <Checkbox className="checkBox" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                            <img src={C} className="fireNone RarityIMG" alt="C" />
                            <img src={U} className="water RarityIMG" alt="U" />
                            <Checkbox className="checkBox1" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                        </div>
                        <div className="line2">
                            <Checkbox className="checkBox" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                            <img src={R} className="fireNone RarityIMG" alt="R" />
                            <img src={SR} className="water RarityIMG" alt="SR" />
                            <Checkbox className="checkBox1" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                        </div>
                        <div className="line3">
                            <Checkbox className="checkBox" 
                                labelStyle={{color: 'white'}}
                                iconStyle={{fill: 'white'}}
                            />
                            <img src={UR} className="fireNone RarityIMG" alt="UR" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-9 rightDiv">
                <div className="RightHead">
                    <p className="result_amount">302 results</p>
                    <div className="LSelect">
                        <select class="form-select selectname" arial-label="Default select example">
                            <option selected>All</option>
                            <option value="1">All1</option>
                            <option value="2">All2</option>
                            <option value="3">All3</option>
                            <option value="4">All4</option>
                        </select>
                    </div>
                    <div className="RSelect">
                            <select class="form-select selectname" arial-label="Default select example">
                                <option selected>Data Acquired</option>
                                <option value="1">Data Acquired1</option>
                                <option value="2">Data Acquired2</option>
                                <option value="3">Data Acquired3</option>
                                <option value="4">Data Acquired4</option>
                            </select>
                    </div>
                    <div className="RSearch">
                        <div className="search_box">
                            <img src={Search} className="searchIMG" alt="search" />
                            <input className="searchInput" placeholder="Search by ID or Name"></input>
                        </div>
                    </div>
                </div>
                <div className="RightMain">
                    <div className="eachDiv">
                        <div>
                            <div className="itemID">#135</div>
                            <img src={Elect} className="elect" alt="elect" />
                        </div>
                        <img src={One} className="oneIMG" alt="one" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">920.4K</p>
                            <p className="price2">$537.10</p>
                        </div>
                    </div>
                    <div className="eachDiv">
                    <div>
                            <div className="itemID">#241</div>
                            <img src={Water} className="elect" alt="Water" />
                        </div>
                        <img src={Two} className="oneIMG" alt="Two" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">750.5K</p>
                            <p className="price2">$425.60</p>
                        </div>
                    </div>
                    <div className="eachDiv">
                    <div>
                            <div className="itemID">#5</div>
                            <img src={FireNone} className="elect" alt="FireNone" />
                        </div>
                        <img src={Three} className="oneIMG" alt="Three" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">1.4M</p>
                            <p className="price2">$830.55</p>
                        </div>
                    </div>
                    <div className="eachDiv">
                    <div>
                            <div className="itemID">#526</div>
                            <img src={Snow} className="elect" alt="Snow" />
                        </div>
                        <img src={Four} className="oneIMG" alt="Four" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">1.1M</p>
                            <p className="price2">$705.20</p>
                        </div>
                    </div>
                    <div className="eachDiv">
                    <div>
                            <div className="itemID">#438</div>
                            <img src={Tree} className="elect" alt="Tree" />
                        </div>
                        <img src={Five} className="oneIMG" alt="Five" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">734.4K</p>
                            <p className="price2">$402.25</p>
                        </div>
                    </div>
                </div>
                <div className="RightMain">
                    <div className="eachDiv">
                        <div>
                            <div className="itemID">#135</div>
                            <img src={Elect} className="elect" alt="elect" />
                        </div>
                        <img src={One} className="oneIMG" alt="one" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">920.4K</p>
                            <p className="price2">$537.10</p>
                        </div>
                    </div>
                    <div className="eachDiv">
                    <div>
                            <div className="itemID">#241</div>
                            <img src={Water} className="elect" alt="Water" />
                        </div>
                        <img src={Two} className="oneIMG" alt="Two" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">750.5K</p>
                            <p className="price2">$425.60</p>
                        </div>
                    </div>
                    <div className="eachDiv">
                    <div>
                            <div className="itemID">#5</div>
                            <img src={FireNone} className="elect" alt="FireNone" />
                        </div>
                        <img src={Three} className="oneIMG" alt="Three" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">1.4M</p>
                            <p className="price2">$830.55</p>
                        </div>
                    </div>
                    <div className="eachDiv">
                    <div>
                            <div className="itemID">#526</div>
                            <img src={Snow} className="elect" alt="Snow" />
                        </div>
                        <img src={Four} className="oneIMG" alt="Four" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">1.1M</p>
                            <p className="price2">$705.20</p>
                        </div>
                    </div>
                    <div className="eachDiv">
                    <div>
                            <div className="itemID">#438</div>
                            <img src={Tree} className="elect" alt="Tree" />
                        </div>
                        <img src={Five} className="oneIMG" alt="Five" />
                        <div className="ratingDiv">
                            <img src={Rating} className="ratingIMG" alt="rating" />
                            <p className="price1">734.4K</p>
                            <p className="price2">$402.25</p>
                        </div>
                    </div>
                </div>
            </div>
          </div> */}
          <img src={ComeSoon} className="comeSoon" alt="Coming Soon" />
      </div>
  );
}
export default Zard;
