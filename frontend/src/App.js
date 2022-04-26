import React, {useState, createContext, useCallback, useEffect} from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import Header from "./components/Header";
import Countdown from "./components/Countdown";
import DifficultySelection from "./components/DifficultySelection";

export const AppContext = createContext();

const App = () =>{

    const worldLengthUrl = 'http://localhost:8000/api/game/new_game'
    const [board, setBoard] = useState([])

    const [position, setPosition] = useState(0)

    const [attempt, setAttempt] = useState(0)

    const [length, setLength] = useState(0)

    const [difficulty, setDifficulty] = useState(0)



    useEffect(() => {
        async function getWordLength() {
            const response = await fetch(worldLengthUrl)
            const wordLength = await response.json()

            setLength(await wordLength.length - 1)

            return wordLength.length
        }

        getWordLength()
    },[])

    useEffect(() => {
        async function createGame() {
            const boardSize = [difficulty, length]
            const tempBoard = []

            for (let i=0; i <= boardSize[0]; i++) {
                tempBoard.push([])
                for (let v=0; v <= boardSize[1]; v++) {
                    if (v === 0 && i === 0){
                        tempBoard[i][v] = {letter: "", color: "gray", active: true}
                    }else{
                        tempBoard[i][v] = {letter: "", color: "gray", active: false}
                    }
                }
            }

            console.log(123)
            setBoard(tempBoard)

            return tempBoard
        }
        createGame()
    }, [difficulty])


    const currBoard = [...board]
    const currPosition = position
    const currAttempt = attempt


    const selectLetter = (letter) => {
        if (currPosition <= length) {
            currBoard[currAttempt][currPosition].letter = letter
            currBoard[currAttempt][currPosition].active = false
            if (currPosition < length) {
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
            if (currPosition <= length) {
                currBoard[currAttempt][currPosition].active = false
            }
            setPosition(currPosition - 1)
            setBoard(currBoard)
        }
    }


    const submitTry = () => {
        if(currPosition > length){
            console.log(currBoard[currAttempt])

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

    if (difficulty){
        return (
            <>
                <Header/>
                <Countdown/>
                <AppContext.Provider value={{board, setBoard, position, setPosition, attempt, setAttempt, selectLetter, handleKeyboard, delLetter, submitTry, difficulty}}>
                    <Board/>
                    <Keyboard/>
                </AppContext.Provider>
            </>
        )
    }

        return (
            <>
                <Header/>
                <Countdown/>
                <DifficultySelection setDifficulty={setDifficulty}/>
            </>

        );
}

export default App;
