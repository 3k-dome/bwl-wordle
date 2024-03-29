import React, {useRef, useEffect} from "react";
import gameOver from "./GameOver";

const Login = ({setSaveGame ,setGameOver ,setBoard ,setAttempt ,setKeyColor ,jwtToken, setJwtToken ,port, loggedIn, setLoggedIn, loginMsg, setLoginMsg, setDifficulty, setScore}) => {

    const username = useRef()
    const password = useRef()

    const registerUrl = `${port}/auth/register`
    const loginUrl = `${port}/auth/login`
    const logoutUrl = `${port}/auth/logout`

    //function to change states in terms that app knows user is logged in
    const login = async (e) => {
        e.preventDefault()
        const [response, status] = await loginFetch(username.current.value, password.current.value)

        if (Number(status) === 400) {
            const responseMsg = response.msg
            setLoginMsg(responseMsg)
        } else if (Number(status) === 200) {
            setLoginMsg(`Logged in as: ${username.current.value}`)
            setJwtToken(response.token)
            setLoggedIn(!loggedIn)
        }
    }

    //check if save game is available
    const checkForState = async () => {
        if (jwtToken !== '') {
            try {
                const response = await fetch(port + '/state/load', {
                    method: 'get',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwtToken}`
                    }
                });

                const data = await response.json()
                const status = response.status

                return [data, status]
            } catch (error) {
                return 'No save game found'
            }

        }
    }

    //if logged in get game state and store jwt local
    useEffect(() => {
        const storeJWT = () => {
            localStorage.setItem('jwt', JSON.stringify(jwtToken))
        }

        const setSate = async () => {
            const [data, status] = await checkForState();

            if (status === 200) {
                setBoard(data.board)
                setSaveGame(true)
                setScore(data.score)
                setDifficulty(data.difficulty)

                setKeyColor(data.keyColor)

                if (data['game-over']) {
                    setGameOver(data['game-over'])
                    setAttempt(data.attempt)
                } else {
                    setAttempt(data.attempt+1)
                }
            } else {
                console.log('No save game found')
                setBoard([])
                setKeyColor({})
                setDifficulty()
                setAttempt(0)
                setGameOver([false, false])
                localStorage.clear()
            }
        }

        storeJWT()
        setSate()
    }, [jwtToken])

    //function to register new user
    const register = async (e) => {
        e.preventDefault()
        const [response, status] = await registerFetch(username.current.value, password.current.value)
        if (Number(status) === 400) {
            const responseMsg = response.msg
            setLoginMsg(responseMsg)
        } else if (Number(status) === 201) {
            setLoginMsg(`User successfully registered!`)
        }


    }

    //register API call
    const registerFetch = async (username, password) => {
        try{
            const response = await fetch(registerUrl, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const data = await response.json()
            const status = response.status
            return (
                [data, status]
            )
        }
        catch (error) {
            console.log(error)
        }
    }

    //login API call
    const loginFetch = async (username, password) => {
        try {
            const response = await fetch(loginUrl, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const data = await response.json()
            const status = response.status
            return (
                [data, status]
            )

        }
        catch (error) {
            console.log(error)
        }
    }

    //function to tell app that user is logged out
    const logout = async (e) => {
        e.preventDefault()

        if (loginMsg !== 'Guest') {
            const response = await logoutFetch(JSON.parse(localStorage.getItem('jwt')))
        }

        localStorage.clear()

        window.location.reload(false);
    }

    //logout API call
    const logoutFetch = async (token) => {
        try {
            const response = await fetch(logoutUrl, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await response.json()
            return data
        }
        catch (error) {
            console.log(error)
        }
    }

    //tell app a guest is logged in
    const guest = () => {
        setLoggedIn(!loggedIn)
        setLoginMsg(`Guest`)
    }

    return (
            <form action="" className={'login-form'}>
                <div className="login-form-info">{loginMsg}</div>
                <div className="loggedIn" style={{display: !loggedIn? 'flex' : 'none'}}>
                    <div className={'login-form-username'}>
                        <input ref={username} type="text" name={'username'} className={'login-form-username-input'} required={true}/>
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="login-form-password">
                        <input ref={password} type="password" name="password" className="login-form-password-input" required={true}/>
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className={'login-form-submit'}>
                        <input type="submit" value={'Login'} onClick={login}/>
                        <input type="submit" value={'Register'} onClick={register}/>
                        <span onClick={guest}>Proceed as guest</span>
                    </div>
                </div>
                <div className="notLoggedIn" style={{display: loggedIn? 'flex' : 'none'}}>
                    <div className="login-form-submit" >
                        <button  value={'Logout'} onClick={logout}><span className="material-symbols-outlined">logout</span></button>
                    </div>
                </div>


            </form>
    );
}

export default Login