import React, {useContext, useRef} from "react";
import {AppContext} from "../App";
import Slider from "./Slider";

const Leaderboard = ({leaderboard, displayLeaderboard}) => {

    const stats = {
        "totalstats": {
            "hitrate":"0.2",
            "successrate": "0.9",
            "totalscore": "200"
        },
        "easystats": {
            "hitrate":"0.5",
            "successrate": "0.2",
            "totalscore": "167"
        },
        "midstats": {
            "hitrate":"0.25",
            "successrate": "0.78",
            "totalscore": "687"
        },
        "hardstats": {
            "hitrate":"0.9",
            "successrate": "0.2",
            "totalscore": "308"
        }

    }

    return (
        <div className={`leaderboard ${(displayLeaderboard) ? 'shown' : 'hidden'}`} ref={leaderboard}>
            <div className="leaderboard-content">
                <div className={'leaderboard-content-scoreToday'}>
                    <span className={'scoreToday-title'}>Your score today is:</span>
                    <span className={'scoreToday-score'}>...</span>
                </div>
                <div className="leaderboard-content-statistics">
                    <Slider stats={stats}/>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard