import React from "react";

const Square = ({letter, active, color}) => {

        return (
            //classes for design and letter to be show
            <div className={`square ${color} ${active}`}>{letter}</div>
        )
}

export default Square