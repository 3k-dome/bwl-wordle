import React, {useRef, useState, useEffect} from "react";
import {AppContext} from "../App";

const Login = ({jwtToken, setJwtToken ,port, loggedIn, setLoggedIn, loginMsg, setLoginMsg, setDifficulty}) => {

    const username = useRef()
    const password = useRef()

    const registerUrl = `${port}/auth/register`
    const loginUrl = `${port}/auth/login`
    const logoutUrl = `${port}/auth/logout`

    // const [registerMsg, setRegisterMsg] = useState('')


    const login = async (e) => {
        e.preventDefault()
        const [response, status] = await loginFetch(username.current.value, password.current.value)

        if (Number(status) === 400) {
            const responseMsg = response.split(':')[1].slice(1,-1)
            setLoginMsg(responseMsg)
        } else if (Number(status) === 200) {
            setLoginMsg(`Logged in as: ${username.current.value}`)
            setJwtToken(response)
            setLoggedIn(!loggedIn)
        }
    }

    useEffect(() => {
        const storeJWT = () => {
            console.log(jwtToken)

            localStorage.setItem('jwt', JSON.stringify(jwtToken))
        }

        storeJWT()
    }, [jwtToken])

    const register = async (e) => {
        e.preventDefault()
        const [response, status] = await registerFetch(username.current.value, password.current.value)
        if (Number(status) === 400) {
            const responseMsg = response.split(':')[1].slice(1,-1)
            setLoginMsg(responseMsg)
        } else if (Number(status) === 200) {
            setLoginMsg(`User successfully registered!`)
        }


    }

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
            const data = await response.text()
            const status = response.status
            return (
                [data, status]
            )
        }
        catch (error) {
            console.log(error)
        }
    }

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
            const data = await response.text()
            const status = response.status
            return (
                [data, status]
            )

        }
        catch (error) {
            console.log(error)
        }
    }

    const logout = async (e) => {
        e.preventDefault()
        const response = await logoutFetch(JSON.parse(localStorage.getItem('jwt')))

        console.log(response)
        setLoggedIn(!loggedIn)
        setLoginMsg('')
        setJwtToken('')

        if (setDifficulty) {
            setDifficulty(false)
        }
    }

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

    return (
        <div>
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
                    </div>
                </div>
                <div className="notLoggedIn" style={{display: loggedIn? 'flex' : 'none'}}>
                    <div className="login-form-submit" >
                        <input type="submit" value={'Logout'} onClick={logout}/>
                    </div>
                </div>


            </form>
        </div>
    );
}

export default Login