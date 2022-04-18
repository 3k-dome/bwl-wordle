import React from "react";
import Key from "./Key";

const Keyboard = () => {
        return (
            <div className={"keyboard"}>
                <div className="keyboard-row">
                    <Key letter={"Q"}/>
                    <Key letter={"W"}/>
                    <Key letter={"E"}/>
                    <Key letter={"R"}/>
                    <Key letter={"T"}/>
                    <Key letter={"Z"}/>
                    <Key letter={"U"}/>
                    <Key letter={"I"}/>
                    <Key letter={"O"}/>
                    <Key letter={"P"}/>
                    <Key letter={"Ü"}/>
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
                    <Key letter={"Ö"}/>
                    <Key letter={"Ä"}/>
                </div>
                <div className="keyboard-row">
                    <Key letter={"DEL"}/>
                    <Key letter={"Y"}/>
                    <Key letter={"X"}/>
                    <Key letter={"C"}/>
                    <Key letter={"V"}/>
                    <Key letter={"B"}/>
                    <Key letter={"N"}/>
                    <Key letter={"M"}/>
                    <Key letter={"ENTER"}/>
                </div>
            </div>
        );
}

export default Keyboard