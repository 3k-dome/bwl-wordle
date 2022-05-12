import React from "react";

const Square = ({letter, active, color}) => {

        return (
            <div className={`square ${color} ${active}`}>{letter}</div>
        )
}

export default Square