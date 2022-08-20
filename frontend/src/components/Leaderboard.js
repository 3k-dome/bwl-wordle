import React, {useContext, useRef} from "react";
import {AppContext} from "../App";
import Slider from "./Slider";

const Leaderboard = ({leaderboard, displayLeaderboard, stats, difficulties, score}) => {

    return (
        <div className={`leaderboard ${(displayLeaderboard) ? 'shown' : 'hidden'}`} ref={leaderboard}>
            <div className="leaderboard-content">
                <div className={'leaderboard-content-scoreToday'}>
                    <span className={'scoreToday-title'}>Your score today is</span>
                    <span className={'scoreToday-score'}>{score.score}</span>
                </div>
                <div className="leaderboard-content-statistics">
                    <Slider stats={stats} difficulties={difficulties}/>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard