import React from "react";

const Square = ({letter, active}) => {

        return (
            <div className={"square"} id={active}>{letter}</div>
        )
}

export default Square