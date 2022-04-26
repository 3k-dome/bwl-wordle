import React, {useContext} from "react";

const DifficultySelection = ({setDifficulty}) => {

    const getDifficulty = (e) => {
        setDifficulty(e.target.dataset.attempts -1)
    }

    return (
        <div className={"difficulty-container"} onClick={getDifficulty}>
            <div className={"difficulty"} data-attempts={3}>3 attempts</div>
            <div className={"difficulty"} data-attempts={6}>6 attempts</div>
            <div className={"difficulty"} data-attempts={9}>9 attempts</div>
        </div>
    )
}

export default DifficultySelection