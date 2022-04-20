import React, {useContext} from "react";
import {AppContext} from "../App";

const Key = ({letter}) => {
        const {selectLetter} = useContext(AppContext)

        return (
            <div className={"key"} onClick={() => selectLetter(letter)}>{letter}</div>
        );
}

export default Key