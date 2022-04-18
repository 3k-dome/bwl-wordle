import React from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import Header from "./components/Header";

const App = () =>{

        const defaultBoard = [
            [{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"}],
            [{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"}],
            [{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"}],
            [{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"}],
            [{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"}],
            [{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"},{letter:"", color:"gray"}]
            ]
        return (
            <>
                <Header/>
                <Board board={defaultBoard}/>
                <Keyboard/>
                </>

        );
}

export default App;
