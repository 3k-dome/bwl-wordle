import React, {useContext} from "react";
import {AppContext} from "../App";

const Key = ({letter,color}) => {
        const {selectLetter} = useContext(AppContext)

        return (
            <div className={`key ${color}`} onClick={() => selectLetter(letter)}>{letter}</div>
        );
}

export default Key