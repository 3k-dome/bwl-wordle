import React, {useContext, useEffect, useRef} from "react";
import Key from "./Key";
import {AppContext} from "../App";

const Keyboard = () => {

    const {handleKeyboard, delLetter, submitTry, board, attempt, notInitialRender} = useContext(AppContext)



        return (
            <div className={"keyboard"} onKeyDown={handleKeyboard}>
                <div className="keyboard-row">
                    <Key letter={"Q"}/>
                    <Key letter={"W"}/>
                    <Key letter={"E"} color={''}/>
                    <Key letter={"R"}/>
                    <Key letter={"T"}/>
                    <Key letter={"Z"}/>
                    <Key letter={"U"}/>
                    <Key letter={"I"}/>
                    <Key letter={"O"}/>
                    <Key letter={"P"}/>
                </div>
                <div className="keyboard-row">
                    <Key letter={"A"}/>
                    <Key letter={"S"}/>
                    <Key letter={"D"}/>
                    <Key letter={"F"}/>
                    <Key letter={"G"}/>
                    <Key letter={"H"}/>
                    <Key letter={"J"}/>
                    <Key letter={"K"}/>
                    <Key letter={"L"}/>
                </div>
                <div className="keyboard-row">
                    <div className={"key"} onClick={delLetter}>DEL</div>
                    <Key letter={"Y"}/>
                    <Key letter={"X"}/>
                    <Key letter={"C"}/>
                    <Key letter={"V"}/>
                    <Key letter={"B"}/>
                    <Key letter={"N"}/>
                    <Key letter={"M"}/>
                    <div className={"key"} onClick={submitTry}>ENTER</div>
                </div>
            </div>
        );
}

export default Keyboard