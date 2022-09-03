import React, {useContext} from "react";
import Square from "./Square";
import {AppContext} from "../App";

const Board = () => {
    //retrieve states from App.js
    const {board, boardDiv} = useContext(AppContext)
        return(
            //board container
            <div className={"raster"} ref={boardDiv}>
                {/*row creation in dependency of difficulty*/}
                {board.map((row, index) => {
                return(
                    <div className="raster-row" key={index}>
                        {/*square creation as placeholder for letters, in dependency of word length*/}
                        {row.map((square, index) => {
                               return(
                                   // pass on letter and values for classes
                                <Square letter={square.letter} key={index} active={square.active} color={square.color}/>
                               )
                          })}
                    </div>
                   )
                })}
            </div>
        )
}

export default Board