import React, {useContext, useRef} from "react";
import {AppContext} from "../App";
import Slider from "./Slider";

const Leaderboard = ({leaderboard, displayLeaderboard}) => {

    const stats = {
        "totalstats": {
            "played": "4",
            "won": "2",
            "hitrate":"0.2",
            "successrate": "0.9",
            "avg_taken_tries": "4"
        },
        "easystats": {
            "played": "2",
            "won": "2",
            "hitrate":"0.99",
            "successrate": "1",
            "avg_taken_tries": "8"
        },
        "midstats": {
            "played": "42",
            "won": "27",
            "hitrate":"0.6",
            "successrate": "0.27",
            "avg_taken_tries": "2"
        },
        "hardstats": {
            "played": "73",
            "won": "34",
            "hitrate":"0.98",
            "successrate": "0.92",
            "avg_taken_tries": "6"
        }

    }

    return (
        <div className={`leaderboard ${(displayLeaderboard) ? 'shown' : 'hidden'}`} ref={leaderboard}>
            <div className="leaderboard-content">
                <div className={'leaderboard-content-scoreToday'}>
                    <span className={'scoreToday-title'}>Your score today is</span>
                    <span className={'scoreToday-score'}>675</span>
                </div>
                <div className="leaderboard-content-statistics">
                    <Slider stats={stats}/>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard