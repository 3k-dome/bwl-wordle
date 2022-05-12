import React, {useContext} from "react";
import {AppContext} from "../App";

const Key = ({letter}) => {
        const {selectLetter,keyColor} = useContext(AppContext)

        return (
            <div className={`key ${keyColor[letter]}`} onClick={() => selectLetter(letter)}>{letter}</div>
        );
}

export default Key