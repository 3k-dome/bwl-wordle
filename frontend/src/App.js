import React, {useState, createContext, useCallback, useEffect, useRef} from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import Header from "./components/Header";
import Countdown from "./components/Countdown";
import DifficultySelection from "./components/DifficultySelection";
import GameOver from "./components/GameOver";

export const AppContext = createContext();

const App = () =>{
    //backend server port
    const port = 'http://localhost:8000'

    //urls for api calls
    const worldLengthUrl = `${port}/api/game/new_game`
    const validateInputUrl = `${port}/api/game/validate_input`

    const [board, setBoard] = useState([])

    const [position, setPosition] = useState(0)

    const [attempt, setAttempt] = useState(0)

    const [length, setLength] = useState(0)

    const [difficulty, setDifficulty] = useState(0)

    const [gameOver, setGameOver] = useState(false)



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
         function createGame() {
            const boardSize = [difficulty, length]
            const tempBoard = []

            for (let i=0; i <= boardSize[0]; i++) {
                tempBoard.push([])
                for (let v=0; v <= boardSize[1]; v++) {
                    if (v === 0 && i === 0){
                        tempBoard[i][v] = {letter: '', color: '', active: 'active'}
                    }else{
                        tempBoard[i][v] = {letter: '', color: '', active: ''}
                    }
                }
            }
            setBoard(tempBoard)

            return tempBoard
        }
        createGame()
    }, [difficulty])


    const currBoard = [...board]
    const currPosition = position
    const currAttempt = attempt
    const notInitialRender = useRef(false)


    const selectLetter = (letter) => {
        if (currPosition <= length) {
            currBoard[currAttempt][currPosition].letter = letter
            currBoard[currAttempt][currPosition].active = ''
            if (currPosition < length) {
                currBoard[currAttempt][currPosition + 1].active = 'active'
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
            currBoard[currAttempt][currPosition - 1].active = 'active'
            if (currPosition <= length) {
                currBoard[currAttempt][currPosition].active = ''
            }
            setPosition(currPosition - 1)
            setBoard(currBoard)
        }
    }

    async function validateInput(input) {
        try {
            const response = await fetch(validateInputUrl, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'input':input})
            })
            const inputInformation = await response.json()



            return await inputInformation
        }
        catch (error) {
            console.log(error)
        }

    }

    const createWord = (wordArray) => {
        let word = ''
        wordArray.forEach((input) => {
            word += input.letter
        })

        return word
    }

    const colorMapping = (letterInformation, unique = true) => {
        let color
        if(!letterInformation.is_in_word){
            color = 'gray'
            return color
        }else if(!letterInformation.is_at_index || !unique) {
            color = 'orange'
            return color
        }
        if (letterInformation.is_at_index && letterInformation.is_in_word && unique){
            color = 'green'
        }

        return color
    }

    async function submitTry() {
        if(currPosition > length){

            const apiResponse = await validateInput(createWord(currBoard[currAttempt]))
            //is input a word?
            const validInput = await apiResponse.is_valid
            //is input word of the day
            const rightWord = await apiResponse.is_word

            if(rightWord) {
                alert('You got the Word!')
                setGameOver(true)
                return
            }

            if(validInput) {
                //letter information
                const letterInformation = await apiResponse.letters
                let multipleLetter = []
                currBoard[currAttempt].forEach((letter, index) => {


                    if (letterInformation[index].count <= 1){
                        letter.color = colorMapping(letterInformation[index])
                    }else {
                        multipleLetter.push(letter)
                        if(multipleLetter.length === letterInformation[index].count){
                            multipleLetter.forEach(letter => {
                                letter.color = colorMapping(letterInformation[index])
                            })
                        }else {
                            multipleLetter.forEach(letter => {
                                letter.color = colorMapping(letterInformation[index], false)
                            })
                        }
                    }
                })

                currBoard[currAttempt + 1][0].active = 'active'
                setAttempt(currAttempt + 1)
                notInitialRender.current = true

                setPosition(0)
            } else {alert('Choose a valid word')}
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
        if (!gameOver){
        return (
            <>
                <Header/>
                <Countdown/>
                <AppContext.Provider value={{board, setBoard, position, setPosition, attempt, setAttempt, selectLetter, handleKeyboard, delLetter, submitTry, difficulty, notInitialRender}}>
                    {gameOver ? <GameOver/> : null}
                    <Board/>
                    <Keyboard/>
                </AppContext.Provider>
            </>
        )
    } else {
            return (
                <>
                    <Header/>
                    <Countdown/>
                    <GameOver/>
                </>
            )
        }}
        return (
            <>
                <Header/>
                <Countdown/>
                <DifficultySelection setDifficulty={setDifficulty}/>
            </>

        );
}

export default App;
