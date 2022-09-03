import React from "react";

const DifficultySelection = ({setDifficulty, availableDiffs, wordLength}) => {

    const getDifficulty = (e) => {
        setDifficulty(e.target.dataset.attempts -1)
        localStorage.setItem("difficulty", JSON.stringify(e.target.dataset.attempts -1))
    }


    return (
        <div className={"difficulty-container"} onClick={getDifficulty}>
            <p>Today's word consists of {wordLength} letters</p>
            {/*create available difficulties from retrieved information*/}
            {availableDiffs.map((diff, index) => {
                   return <div key={index} className={"difficulty"} data-attempts={diff.tries}>{diff.tries} attempts ({diff.name})</div>
                })
            }
        < /div>
    )
}

export default DifficultySelection