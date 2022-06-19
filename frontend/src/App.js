import React, {
    useState,
    createContext,
    useCallback,
    useEffect,
    useRef,
} from "react";
import './styles.scss'
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import Header from "./components/Header";

import DifficultySelection from "./components/DifficultySelection";
import GameOver from "./components/GameOver";
import Login from "./components/Login";

export const AppContext = createContext();

const App = () => {
    //backend server port
    const port = "http://localhost:8000";

    //urls for api calls
    const worldLengthUrl = `${port}/api/game/new_game`;
    const validateInputUrl = `${port}/api/game/validate_input`;

    const [board, setBoard] = useState([]);

    const [position, setPosition] = useState(0);

    const [attempt, setAttempt] = useState(0);

    const [length, setLength] = useState(0);

    const [difficulty, setDifficulty] = useState(0);

    const [gameOver, setGameOver] = useState([false, false]);

    const [keyColor, setKeyColor] = useState({});

    const [loginMsg, setLoginMsg] = useState('')

    const [loggedIn, setLoggedIn] = useState(false)

    const [jwtToken, setJwtToken] = useState('')


    //get length of todays word
    useEffect(() => {
        async function getWordLength() {
            const response = await fetch(worldLengthUrl);
            const wordLength = await response.json();

            setLength((await wordLength.length) - 1);

            return wordLength.length;
        }
        getWordLength();
    }, []);

    //create the board when user sets difficulty
    useEffect(() => {
        function createGame() {
            //board size defined by difficulty and word length
            const boardSize = [difficulty, length];
            const tempBoard = [];

            //create board object as storage for information
            for (let i = 0; i <= boardSize[0]; i++) {
                tempBoard.push([]);
                for (let v = 0; v <= boardSize[1]; v++) {
                    if (v === 0 && i === 0) {
                        tempBoard[i][v] = {
                            letter: "",
                            color: "",
                            active: "active",
                        };
                    } else {
                        tempBoard[i][v] = { letter: "", color: "", active: "" };
                    }
                }
            }
            setBoard(tempBoard);

            return tempBoard;
        }
        createGame();
    }, [difficulty]);

    const currBoard = [...board];
    const currPosition = position;
    const currAttempt = attempt;
    //needed anymore?
    const notInitialRender = useRef(false);

    //function to add chosen letter to the board
    const selectLetter = (letter) => {
        //only add letter if space is available
        if (currPosition <= length) {
            currBoard[currAttempt][currPosition].letter = letter;
            currBoard[currAttempt][currPosition].active = "";
            //jump to next square
            if (currPosition < length) {
                currBoard[currAttempt][currPosition + 1].active = "active";
            }
            setPosition(currPosition + 1);
            setBoard(currBoard);
        }
    };

    //check if keydown target is a standard letter
    const isLetter = (str) => {
        return str.length === 1 && str.match(/[a-z]/i);
    };

    //remove letter from current square
    const delLetter = () => {
        if (!gameOver[0]) {
            if (currPosition >= 1) {
                currBoard[currAttempt][currPosition - 1].letter = "";
                currBoard[currAttempt][currPosition - 1].active = "active";
                if (currPosition <= length) {
                    currBoard[currAttempt][currPosition].active = "";
                }
                setPosition(currPosition - 1);
                setBoard(currBoard);
            }
        }
    };

    //send user input to API to validate it
    async function validateInput(input) {
        try {
            const response = await fetch(validateInputUrl, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: input }),
            });
            const inputInformation = await response.json();

            return await inputInformation;
        } catch (error) {
            console.log(error);
        }
    }

    //API only receives whole word, function to transform row array into single string
    const createWord = (wordArray) => {
        let word = "";
        wordArray.forEach((input) => {
            word += input.letter;
        });

        return word;
    };

    //function which returns color in dependency on letter occurrence in todays word
    const colorMapping = (letterInformation, unique = true) => {
        if (!letterInformation.is_in_word) {
            return 'gray';
        } else if (!letterInformation.is_at_index) {
            return 'orange';
        }else {
            return 'green'
        }
    };

    //additional function for change of keyboard color after each submit
    const colorOverride = (oldKeyColor, colorNow) => {
        if (oldKeyColor) {
            if (oldKeyColor === colorNow) {
                return colorNow;
            } else if (colorNow === "green") {
                return colorNow;
            } else if (oldKeyColor === "green") {
                return oldKeyColor;
            } else if (oldKeyColor === "gray") {
                return colorNow;
            } else if (oldKeyColor === "orange") {
                return oldKeyColor;
            }
        } else {
            return colorNow;
        }
    };

    //function which unites API call and color feedback
    async function submitTry() {
        if (!gameOver[0]) {
            if (currPosition > length) {
                const apiResponse = await validateInput(
                    createWord(currBoard[currAttempt])
                );
                //is input a word?
                const validInput = await apiResponse.is_valid;
                //is input word of the day
                const rightWord = await apiResponse.is_word;
                //letter information
                const letterInformation = await apiResponse.letters;

                if (rightWord) {
                    let keyColors = {};
                    currBoard[currAttempt].forEach((letter, index) => {
                        letter.color = colorMapping(letterInformation[index]);
                        keyColors[letter.letter] = colorOverride(
                            keyColor[letter.letter],
                            letter.color
                        );
                    });
                    setKeyColor({ ...keyColor, ...keyColors });
                    setGameOver([true, true]);
                    return;
                }

                if (validInput) {
                    let multipleLetter = [];
                    let keyColors = {};

                    currBoard[currAttempt].forEach((letter, index) => {
                        //if (letterInformation[index].count <= 1) {
                            letter.color = colorMapping(
                                letterInformation[index]
                            );

                        //console.log(letterInformation[index])
                            keyColors[letter.letter] = colorOverride(
                                keyColor[letter.letter],
                                letter.color
                            );
                        //} else {
                            letter.index = index
                            letter.count = letterInformation[index].count
                            multipleLetter.push(letter);
                        //}
                    });

                    multipleLetter = multipleLetter.filter(letter => letter.color !== 'gray')

                    const allLetters = multipleLetter.map(letter => {
                        return letter.letter
                    })

                    const uniqueLetters = [...new Set(allLetters)]

                    console.log(uniqueLetters)

                    //console.log(multipleLetter.filter(letter => letter.letter === 'S'))

                    uniqueLetters.forEach(unique => {
                        const uniqueLetterArray = multipleLetter.filter(letter => letter.letter === unique)
                        //console.log(uniqueLetterArray)
                        uniqueLetterArray.sort((a, b) => a.color.localeCompare(b.color));
                        console.log(uniqueLetterArray)
                        uniqueLetterArray.forEach((letter, index) => {
                            if (uniqueLetterArray.length > letter.count) {
                                if (index <= letter.count -1) {
                                    letter.color = colorMapping(
                                        letterInformation[letter.index]
                                    )
                                } else {
                                    letter.color = 'gray'
                                }
                            }

                        })
                    })

                    if (currAttempt < difficulty) {
                        currBoard[currAttempt + 1][0].active = "active";
                        setAttempt(currAttempt + 1);
                        notInitialRender.current = true;
                        setKeyColor({ ...keyColor, ...keyColors });
                    } else {
                        setGameOver([true, false]);
                    }

                    setPosition(0);
                } else {
                    alert("Choose a valid word");
                }
            }
        }
    }

    //keyboard events
    const handleKeyboard = useCallback((event) => {
        if (difficulty && loggedIn) {
            if (event.key === "Enter") {
                submitTry();
            } else if (event.key === "Backspace") {
                delLetter();
            } else if (isLetter(event.key)) {
                selectLetter(event.key.toUpperCase());
            }
        }
    });

    useEffect(() => {
        document.addEventListener("keydown", handleKeyboard);
        return () => {
            document.removeEventListener("keydown", handleKeyboard);
        };
    }, [handleKeyboard]);

    const gameOverModal = useRef();

    //page presentation in dependency on current states (difficulty set?, game over?)
    if (!loggedIn) {
        return (
            <>
                <Header loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                <Login jwtToken={jwtToken} setJwtToken={setJwtToken} loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
            </>
        );
    } else if (!difficulty) {
        return (
            <>
                <Header jwtToken={jwtToken} setJwtToken={setJwtToken} loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                <DifficultySelection setDifficulty={setDifficulty} />
            </>
        );
    } else {
        return (
            <>
                <Header jwtToken={jwtToken} setJwtToken={setJwtToken} setDifficulty={setDifficulty} gameOver={gameOver[0]} gameOverModal={gameOverModal} loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

                <AppContext.Provider
                    value={{
                        board,
                        setBoard,
                        position,
                        setPosition,
                        attempt,
                        setAttempt,
                        selectLetter,
                        handleKeyboard,
                        delLetter,
                        submitTry,
                        difficulty,
                        notInitialRender,
                        keyColor,
                    }}
                >
                    {gameOver[0] ? (
                        <GameOver
                            attempts={currAttempt + 1}
                            won={gameOver[1]}
                            gameOverModal={gameOverModal}
                        />
                    ) : null}
                    <Board />
                    <Keyboard />
                </AppContext.Provider>
            </>
        );
    }
};

export default App;
