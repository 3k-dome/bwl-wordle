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
import Leaderboard from "./components/Leaderboard";

export const AppContext = createContext();

const App = () => {
    //backend server port
    const port = "/api";

    //urls for api calls
    const worldLengthUrl = `${port}/game/new_game`;
    const validateInputUrl = `${port}/game/validate_input`;

    //used states
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

    const [displayLeaderboard, setDisplayLeaderboard] = useState(false)

    const [stats, setStats] = useState([])

    const [availableDiffs, setDiffs] = useState([])

    const [score, setScore] = useState({})

    const [session, setSession] = useState({})

    const [saveGame, setSaveGame] = useState()

    const boardDiv = useRef()

    const keyBoardDiv = useRef()

    const leaderboard = useRef()



    //get length of today's word and defined session time for countdown
    useEffect(() => {
        async function getWordLength() {
            const response = await fetch(worldLengthUrl);
            const data = await response.json();

            setLength((await data.length) - 1);

            setSession({'start': await data.session_start, 'end': await data.session_end})
        }
        getWordLength()
    }, []);


    //get available difficulties
    useEffect(() => {
        const getDiffUrl = port + '/game/difficulties'

        async function getDifficulties() {

            try {
                const response = await fetch(getDiffUrl);
                const data = await response.json()

                setDiffs(data)
            } catch (error) {
                console.log(error)
            }

        }

        getDifficulties()
    }, [])

    //create the board when user sets difficulty
    useEffect( () => {
        if (!saveGame) {

        async function createGame() {

            //if content in local storage exists retrieve information and build board
            if(localStorage.getItem("board")) {
                setBoard(JSON.parse(localStorage.getItem("board")))
                setDifficulty(JSON.parse(localStorage.getItem("difficulty")))
                setKeyColor(JSON.parse(localStorage.getItem("keyColor")))

                if (localStorage.getItem("game-over")) {
                    setGameOver(JSON.parse(localStorage.getItem("game-over")))
                    setAttempt(JSON.parse(localStorage.getItem("attempt")))
                } else {
                    setAttempt(JSON.parse(localStorage.getItem("attempt"))+1)
                }
        }else {
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
            }
        }

        createGame();

        } else {
            console.log('save game loaded')
        }
    }, [difficulty]);

    //get user stats as soon as a user is logged in
    useEffect(  () => {
        if (jwtToken !== '') {
            async function getAndSetStats () {
                const currStats = await fetchCurrentScore()
                setStats(currStats)
            }
            getAndSetStats()
        }

    }, [jwtToken])

    const currBoard = [...board];
    const currPosition = position;
    const currAttempt = attempt;
    //needed anymore?
    const notInitialRender = useRef(false);

    //function to add chosen letter to the board
    const selectLetter = (letter) => {
        //only add letter if space is available
        if (!gameOver[0]) {
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
        }
    };

    //check if keydown target is a standard letter
    const isLetter = (str) => {
        return str.length === 1 && str.match(/[a-z]/i);
    };

    //remove letter from current square and move on back
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
                body: JSON.stringify({ word: input }),
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

    //function which returns color in dependency on letter occurrence in today's word
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

    //creation of object which API can receive to calculate score
    const createScoreObject = (difficulty, attempts, board) => {
        const stats = {}

        stats.max_tries = difficulty + 1
        stats.taken_tries = attempts + 1

        //score object only needs amount of found letters
        const letterAtIndexArray = []

        for (let i = 0; i < board[0].length; i++) {
            letterAtIndexArray.push(false)
        }

        for (let i = 0; i <= attempts; i++) {
            board[i].forEach((letter, index) => {
                if (letter.color === 'green') {
                    letterAtIndexArray[index] = true
                }
            })
        }

        stats.found_letters = letterAtIndexArray.filter(letter => letter === true).length

        return stats
    }

    //add score to user stats
    const addScore = async (stats) => {
        const scoreUrl = port + '/score/add'

        try {
            const response = await fetch(scoreUrl, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: JSON.stringify(stats)
            })

            const data = await response.json()
            localStorage.setItem("score", JSON.stringify(data))
            setScore(data)
        } catch (error) {
            console.log(error)
            setScore([])
        }
    }

    //get score of logged user
    const fetchCurrentScore = async () => {
        if (jwtToken) {
            const scoreSummaryUrl = port + '/score/summary'

            try {
                const response = await fetch(scoreSummaryUrl, {
                    method: 'get',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwtToken}`
                    },
                })
                const data = await response.json()

                return await data
            } catch (error) {
                console.log(error)
            }
        }
    }

    //put current game state to data base
    const putStateToDB = async() => {
        const state = {}

        //local storage as information provider
        for (let i = 0; i < localStorage.length; i++){
            if (localStorage.key(i) !== 'jwt') {
                state[localStorage.key(i)] = JSON.parse(localStorage.getItem(localStorage.key(i)))
            }
        }
        
        const body = JSON.stringify(state).replaceAll("\\", "")

        const stateToDbUrl = port+ '/state/save'

        try {
            if (jwtToken !== '') {
                const response = await fetch(stateToDbUrl, {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    body: body
                })
                const data = await response.json()
            }
        } catch (error) {
            console.log(error)
        }
    }

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

                const letterInformationArray = []
                
                //case if right word was found
                if (rightWord) {
                    let keyColors = {};
                    currBoard[currAttempt].forEach((letter, index) => {
                        letter.color = colorMapping(letterInformation[index]);
                        keyColors[letter.letter] = colorOverride(
                            keyColor[letter.letter],
                            letter.color
                        );
                    });
                    const newKeyColors = { ...keyColor, ...keyColors }

                    setKeyColor(newKeyColors);
                    setGameOver([true, true]);

                    //put all information to local storage
                    localStorage.setItem("game-over", JSON.stringify([true, true]))
                    localStorage.setItem("board", JSON.stringify(currBoard))
                    localStorage.setItem("keyColor", JSON.stringify({ ...keyColor, ...keyColors }))
                    localStorage.setItem("attempt", JSON.stringify(currAttempt))

                    //add score from created score object
                    await addScore(createScoreObject(difficulty, currAttempt, currBoard))

                    //get new score and metrics
                    const currStats = await fetchCurrentScore()

                    setStats(currStats)

                    await putStateToDB()

                    return;
                }

                //in case the input was valid but not the exact word
                if (validInput) {
                    //array for color correction
                    let validLetters = [];
                    let keyColors = {};

                    //get and set board and key color for each letter
                    currBoard[currAttempt].forEach((letter, index) => {
                            letter.color = colorMapping(
                                letterInformation[index]
                            );

                            keyColors[letter.letter] = colorOverride(keyColor[letter.letter], letter.color);

                            //add additional information for color correction
                            letter.index = index
                            letter.count = letterInformation[index].count
                            validLetters.push(letter);
                    });

                    //reduce array to only valid letters
                    validLetters = validLetters.filter(letter => letter.color !== 'gray')

                    //reference array with only letter property
                    const allLetters = validLetters.map(letter => {
                        return letter.letter
                    })

                    //each letter is only needed once
                    const uniqueLetters = [...new Set(allLetters)]

                    //do color correction for each unique letter
                    uniqueLetters.forEach(unique => {
                        //get all letter objects where the actual letter equals the current one in the unique array
                        const uniqueLetterArray = validLetters.filter(letter => letter.letter === unique)

                        //sort them after their color property
                        uniqueLetterArray.sort((a, b) => a.color.localeCompare(b.color));

                        //iterate through them to change color in dependency of letter frequency
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

                    const newKeyColors = { ...keyColor, ...keyColors }

                    //jump to next tries if some are left
                    if (currAttempt < difficulty) {
                        currBoard[currAttempt + 1][0].active = "active";
                        setAttempt(currAttempt + 1);
                        notInitialRender.current = true;

                    } else {
                        setGameOver([true, false]);
                        createScoreObject(difficulty, currAttempt, currBoard)
                        localStorage.setItem("game-over", JSON.stringify([true, false]))
                        await addScore(createScoreObject(difficulty, currAttempt, currBoard))

                        const currStats = await fetchCurrentScore()

                        setStats(currStats)
                    }


                    setKeyColor(newKeyColors);
                    setPosition(0);
                    localStorage.setItem("board", JSON.stringify(currBoard))
                    localStorage.setItem("attempt", JSON.stringify(currAttempt))
                    localStorage.setItem("keyColor", JSON.stringify(newKeyColors))

                    await putStateToDB()

                } else {
                    //show little animation when input is invalid
                    boardDiv.current.children[currAttempt].classList.toggle('invalid')
                    setTimeout(() => {
                        boardDiv.current.children[currAttempt].classList.toggle('invalid')
                    }, 150)
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

    //add keyboard events to app
    useEffect(() => {
        document.addEventListener("keydown", handleKeyboard);
        return () => {
            document.removeEventListener("keydown", handleKeyboard);
        };
    }, [handleKeyboard]);

    const gameOverModal = useRef();

    //page presentation in dependency on current states (already logged in?, difficulty set?, game over?)
    if (!loggedIn) {
        return (
            <>
                <Header session={session} loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn} leaderboard={leaderboard} displayLeaderboard={displayLeaderboard} setDisplayLeaderboard={setDisplayLeaderboard}/>
                <Login  setSaveGame={setSaveGame} setGameOver={setGameOver} setBoard={setBoard} setScore={setScore} jwtToken={jwtToken} setJwtToken={setJwtToken} loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
            </>
        );
    } else if (!difficulty) {
        return (
            <>
                <Header session={session} gameOver={gameOver[0]} gameOverModal={gameOverModal} loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn} leaderboard={leaderboard} displayLeaderboard={displayLeaderboard} setDisplayLeaderboard={setDisplayLeaderboard}/>
                <div className="user">
                    <div style={{display: loggedIn? 'block' : 'none'}}>
                        <Login setSaveGame={setSaveGame} setGameOver={setGameOver} setBoard={setBoard} setAttempt={setAttempt} setScore={setScore} setKeyColor={setKeyColor} jwtToken={jwtToken} setJwtToken={setJwtToken} setDifficulty={setDifficulty}  loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
                    </div>
                </div>
                <Leaderboard leaderboard={leaderboard} displayLeaderboard={displayLeaderboard} stats={stats} difficulties={availableDiffs} score={score} jwt={jwtToken}
                />
                <DifficultySelection wordLength={length + 1} setDiffs={setDiffs} availableDiffs={availableDiffs} port={port} setDifficulty={setDifficulty} />
            </>
        );
    } else {
        return (
            <>
                <Header session={session} gameOver={gameOver[0]} gameOverModal={gameOverModal} loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn} leaderboard={leaderboard} displayLeaderboard={displayLeaderboard} setDisplayLeaderboard={setDisplayLeaderboard}/>
                <div className="user">
                    <div style={{display: loggedIn? 'block' : 'none'}}>
                        <Login setSaveGame={setSaveGame} setGameOver={setGameOver} setBoard={setBoard} setAttempt={setAttempt} setScore={setScore} setKeyColor={setKeyColor} jwtToken={jwtToken} setJwtToken={setJwtToken} setDifficulty={setDifficulty}  loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
                    </div>
                </div>
                <AppContext.Provider
                    value={{board, setBoard, position, setPosition, attempt, setAttempt, selectLetter, handleKeyboard, delLetter, submitTry, difficulty, notInitialRender, keyColor, keyBoardDiv, boardDiv
                    }}
                >
                    {gameOver[0] ? (
                        <GameOver
                            attempts={currAttempt + 1} won={gameOver[1]} gameOverModal={gameOverModal} score={score} difficulties={availableDiffs} stats={stats}
                        />
                    ) : null}
                        <Leaderboard leaderboard={leaderboard} displayLeaderboard={displayLeaderboard} notInitialRender={notInitialRender} stats={stats} difficulties={availableDiffs} score={score} jwt={jwtToken}
                        />
                    <Board boardDiv={boardDiv}/>
                    <Keyboard />
                </AppContext.Provider>
            </>
        );
    }
};

export default App;
