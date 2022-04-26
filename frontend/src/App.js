import React, {useState, createContext, useCallback, useEffect} from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import Header from "./components/Header";
import Countdown from "./components/Countdown";

export const AppContext = createContext();

const App = () =>{

    async function getWordLength() {
        const response = await fetch('http://localhost:8000/api/game/new_game')
        const wordLength = await response.json()

        return wordLength.length
    }

    async function createGame() {
        const boardSize = [6, await getWordLength()]
        const tempBoard = []

        for (let i=0; i <= boardSize[0] - 1; i++) {
            tempBoard.push([])
            for (let v=0; v <= boardSize[1]; v++) {
                tempBoard[i][v] = {letter: "", color: "gray", active: false}
            }
        }

        console.log(tempBoard)

        return tempBoard
    }

    async function defaultBoard() {
        return await createGame()
    }




    const [board, setBoard] = useState(defaultBoard)

    const [position, setPosition] = useState(0)

    const [attempt, setAttempt] = useState(0)

    const currBoard = [...board]
    const currPosition = position
    const currAttempt = attempt

    const selectLetter = (letter) => {
        if (currPosition <= 4) {
            currBoard[currAttempt][currPosition].letter = letter
            currBoard[currAttempt][currPosition].active = false
            if (currPosition <= 3) {
                currBoard[currAttempt][currPosition + 1].active = true
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
            currBoard[currAttempt][currPosition-1].letter = ""
            currBoard[currAttempt][currPosition - 1].active = true
            if (currPosition <= 4) {
                currBoard[currAttempt][currPosition].active = false
            }
            setPosition(currPosition - 1)
            setBoard(currBoard)
        }
    }


    const submitTry = () => {
        if(currPosition === 5){
            console.log(currBoard[0])
            getWordLength()
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
