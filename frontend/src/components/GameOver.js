import React from "react";

const GameOver = ({attempts, won, gameOverModal, score}) => {

    return (
        <div className={'gameOver'} ref={gameOverModal}>
            {/*close button for game over modal*/}
            <span className="material-symbols-outlined" onClick={(e) => e.target.parentElement.style.display = 'none'}>close</span>
            {won ? <p>Congrats! You found the word!</p> : <p>You didn't got today's word. More luck next time!</p>}
            {/*if score is available -> user logged in, show additional information*/}
            {!score.msg && score.score > 0 ?
                <>
                    <p>You needed <span className={'strong'}>{attempts} </span> attempt(s)</p>
                    <p>You earned <span className={'strong'}>{score.score} </span> points</p>
                    <p>New total for selected game mode:  <span className={'strong'}>{score.total_score}</span> points</p>
                </> : null}
        </div>
    )
}

export default GameOver