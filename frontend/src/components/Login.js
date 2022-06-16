import React, {useRef, useState} from "react";
import {AppContext} from "../App";

const Login = ({port}) => {

    const username = useRef()
    const password = useRef()

    const registerUrl = `${port}/auth/register`
    const loginUrl = `${port}/auth/login`

    const [loginMsg, setLoginMsg] = useState('')
    const [jwtToken, setJwtToken] = useState()
    const [loggedIn, setLoggedIn] = useState(false)

    const login = async (e) => {
        e.preventDefault()
        console.log(username.current.value)
        console.log(password.current.value)
        const loginResponse = await loginFetch(username.current.value, password.current.value)

        setLoginMsg(loginResponse.msg)
        if (loginResponse.access_token) {
            setLoginMsg(`Logged in as: ${username.current.value}`)
            setJwtToken(loginResponse.access_token)
            setLoggedIn(!loggedIn)
        }
    }

    const register = (e) => {
        e.preventDefault()
        registerFetch(username.current.value, password.current.value)

    }

    const registerFetch = async (username, password) => {
        try{
            const response = await fetch(registerUrl, {
                method: 'post',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const data = await response.json()
            console.log(data)

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
                    email: username,
                    password: password
                })
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
            <form action="" id={'login-form'}>
                <div id="login-form-info">{loginMsg}</div>
                {!loggedIn ?
                <>
                    <div id={'login-form-username'}>
                        <input ref={username} type="text" name={'username'} id={'login-form-username-input'} />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div id="login-form-password">
                        <input ref={password} type="password" name="password" id="login-form-password-input" required={true}/>
                        <label htmlFor="password">Password</label>
                    </div>
                    <div id={'login-form-submit'}>
                        <input type="submit" value={'Login'} onClick={login}/>
                        <input type="submit" value={'Register'} onClick={register}/>
                    </div>
                </> :
                    <>
                        <div id="login-form-submit">
                            <input type="submit" value={'Logout'}/>
                        </div>
                    </>}
            </form>
        </div>
    );
}

export default Login