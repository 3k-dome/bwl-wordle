import React from "react";
import Square from "./Square";
import square from "./Square";

const Board = ({board}) => {
        return(
            <div className={"raster"}>
                {board.map((row, index) => {
                return(
                <div className="raster-row" key={index}>
                {row.map((square, index) => {
                           return(
                            <Square letter={square.letter} key={index}/>
                           )
                      })}
                    </div>
                   )
                })}
            </div>
        )
}

export default Board