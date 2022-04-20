import React, {useContext} from "react";
import Square from "./Square";
import {AppContext} from "../App";

const Board = () => {
    const {board} = useContext(AppContext)
        return(
            <div className={"raster"}>
                {board.map((row, index) => {
                return(
                <div className="raster-row" key={index}>
                {row.map((square, index) => {
                           return(
                            <Square letter={square.letter} key={index} active={String(square.active)}/>
                           )
                      })}
                    </div>
                   )
                })}
            </div>
        )
}

export default Board