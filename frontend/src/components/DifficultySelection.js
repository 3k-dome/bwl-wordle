import React, {useContext, useEffect, useState} from "react";

const DifficultySelection = ({setDifficulty, port, availableDiffs, setDiffs}) => {

    const getDifficulty = (e) => {
        setDifficulty(e.target.dataset.attempts -1)
        localStorage.setItem("difficulty", JSON.stringify(e.target.dataset.attempts -1))
    }


    return (
        <div className={"difficulty-container"} onClick={getDifficulty}>
            {availableDiffs.map((diff, index) => {
                   return <div key={index} className={"difficulty"} data-attempts={diff.tries}>{diff.tries} attempts ({diff.name})</div>
                })
            }
        < /div>
    )
}

export default DifficultySelection