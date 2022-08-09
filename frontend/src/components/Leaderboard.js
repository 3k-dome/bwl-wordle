import React, {useContext, useRef} from "react";
import {AppContext} from "../App";

const Leaderboard = ({leaderboard, displayLeaderboard}) => {

    return (
        <div className={`leaderboard ${(displayLeaderboard) ? 'shown' : 'hidden'}`} ref={leaderboard}>
            <div className="leaderboard-content">
                <div className={'leaderboard-content-scoreToday'}>
                    <span className={'scoreToday-title'}>Your score today is:</span>
                    <span className={'scoreToday-score'}>...</span>
                </div>
                <div className="leaderboard-content-statistics">
                    <div className="statistics-slider">
                        <div className="btn-before"><span className="material-symbols-outlined">chevron_left</span></div>
                        <div className="statistics-slider-content">
                            <div className="totalStats">
                                <span className="title">Total stats</span>
                                <div className="statistics-content">
                                    <div className="hit-rate-container">
                                        <span>Hit rate</span>
                                        <div className="value">50%</div>
                                    </div>
                                    <div className="success-rate-container">
                                        <span>Success rate</span>
                                        <div className="value">60%</div>
                                    </div>
                                    <div className="total-score-container">
                                        <span>Total score</span>
                                        <div className="value">50%</div>
                                    </div>
                                </div>
                            </div>
                            <div className="easyStats">
                                <span className="title">Total stats</span>

                            </div>
                            <div className="midStats">
                                <span className="title">Total stats</span>
                            </div>
                            <div className="hardStats">
                                <span className="title">Total stats</span>
                            </div>
                        </div>
                        <div className="btn-after"><span className="material-symbols-outlined">chevron_right</span></div>
                        <div className="statistics-slider-dots">...</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard