import React, {useContext, useRef} from "react";
import {AppContext} from "../App";

const Leaderboard = ({leaderboard, displayLeaderboard}) => {

    return (
        <div className={`leaderboard ${(displayLeaderboard) ? 'shown' : 'hidden'}`} ref={leaderboard}>
            <div className="leaderboard-content">You must be logged in to see further statistics</div>
        </div>
    );
}

export default Leaderboard