import React, {useContext} from "react";
import Square from "./Square";
import {AppContext} from "../App";

const Board = () => {
    const {board, boardDiv} = useContext(AppContext)
        return(
            <div className={"raster"} ref={boardDiv}>
                {board.map((row, index) => {
                return(
                <div className="raster-row" key={index}>
                {row.map((square, index) => {
                           return(
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