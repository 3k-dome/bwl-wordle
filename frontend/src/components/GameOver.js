import React from "react";
import {AppContext} from "../App";

const GameOver = ({attempts, won, gameOverModal}) => {
    return (
        <div className={'gameOver'} ref={gameOverModal}>
            <span className="material-symbols-outlined" onClick={(e) => e.target.parentElement.style.display = 'none'}>close</span>
            {won ? <p>Congrats! You found the word!</p> : <p>You didn't got today's word. More luck next time!</p>}
            <p>You needed {attempts} attempt(s)</p>
            <p>score</p>
        </div>
    )
}

export default GameOver