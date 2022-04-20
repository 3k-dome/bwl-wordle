import React, {useState, createContext, useCallback, useEffect} from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import Header from "./components/Header";
import Countdown from "./components/Countdown";

export const AppContext = createContext();

const App = () =>{

    const defaultBoard = [
            [{letter:"", color:"gray", active: true},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false}],
            [{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray" , active: false}],
            [{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray" , active: false}],
            [{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray" , active: false}],
            [{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray" , active: false}],
            [{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray", active: false},{letter:"", color:"gray" , active: false}],
            ]

    const [board, setBoard] = useState(defaultBoard)

    const [position, setPosition] = useState(0)

    const [attempt, setAttempt] = useState(0)

    const currBoard = [...board]
    const currPosition = position
    const currAttempt = attempt
    
    const noEntries = currBoard[0].length
    const noAttempts = currBoard.length
    
    const selectLetter = (letter) => {
        if (currPosition < noEntries) {
            currBoard[currAttempt][currPosition].letter = letter
                currBoard[currAttempt][currPosition].active = false
                if (currPosition < noEntries - 1) {
                    currBoard[currAttempt][currPosition + 1].active = true
                } else {
                    currBoard[currAttempt][currPosition].active = true
                }
                setPosition(currPosition + 1)
                setBoard(currBoard)
        }
    }

    const isLetter = (str) => {
        return str.length === 1 && str.match(/[a-z]/i);
    }

    const delLetter = () => {
        if (currPosition >= 1) {
            currBoard[currAttempt][currPosition - 1].letter = ""
            currBoard[currAttempt][currPosition - 1].active = true
            if (currPosition < noEntries) {
                currBoard[currAttempt][currPosition].active = false
            }
            setPosition(currPosition - 1)
            setBoard(currBoard)
        }
    }

    const submitTry = () => {
        if(currPosition === noEntries){
            console.log(currBoard[0])
            currBoard[currAttempt][noEntries - 1].active = false
            currBoard[currAttempt + 1][0].active = true
            setAttempt(currAttempt + 1)

            setPosition(0)
        }
    }

    const handleKeyboard = useCallback((event) => {
        if (event.key === "Enter") {
            submitTry()
        } else if (event.key === "Backspace"){
            delLetter()
        } else if (isLetter(event.key)){
            selectLetter(event.key.toUpperCase())
        }
    })

    useEffect(() => {
        document.addEventListener("keydown", handleKeyboard)
        return () => {
            document.removeEventListener("keydown", handleKeyboard)
        }
    },[handleKeyboard])

        return (
            <>
                    <Header/>
                    <Countdown/>
                    <AppContext.Provider value={{board, setBoard, position, setPosition, attempt, setAttempt, selectLetter, handleKeyboard, delLetter, submitTry}}>
                        <Board/>
                        <Keyboard/>
                    </AppContext.Provider>
                </>

        );
}

export default App;
