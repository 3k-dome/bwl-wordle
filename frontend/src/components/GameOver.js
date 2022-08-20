import React, {useState, useEffect} from "react";
import {AppContext} from "../App";

const GameOver = ({attempts, won, gameOverModal, score, difficulties, stats}) => {

    // const [points, setPoints] = useState([])
    //
    // useEffect(() => {
    //     setPoints(score)
    // }, [score])


    return (
        <div className={'gameOver'} ref={gameOverModal}>
            <span className="material-symbols-outlined" onClick={(e) => e.target.parentElement.style.display = 'none'}>close</span>
            {won ? <p>Congrats! You found the word!</p> : <p>You didn't got today's word. More luck next time!</p>}
            <p>You needed <span className={'strong'}>{attempts} </span> attempt(s)</p>
            <p>You earned <span className={'strong'}>{score.score} </span> points</p>
            <p>New total for selected game mode:  <span className={'strong'}>{score.total_score}</span> points</p>
        </div>
    )
}

export default GameOver