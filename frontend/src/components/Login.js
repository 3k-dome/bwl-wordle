import React, {useRef, useState, useEffect} from "react";
import {AppContext} from "../App";

const Login = ({setKeyColor ,jwtToken, setJwtToken ,port, loggedIn, setLoggedIn, loginMsg, setLoginMsg, setDifficulty}) => {

    const username = useRef()
    const password = useRef()

    const registerUrl = `${port}/auth/register`
    const loginUrl = `${port}/auth/login`
    const logoutUrl = `${port}/auth/logout`

    // const [registerMsg, setRegisterMsg] = useState('')


    const login = async (e) => {
        e.preventDefault()
        const [response, status] = await loginFetch(username.current.value, password.current.value)
        console.log(response)

        if (Number(status) === 400) {
            const responseMsg = response.msg
            setLoginMsg(responseMsg)
        } else if (Number(status) === 200) {
            setLoginMsg(`Logged in as: ${username.current.value}`)
            setJwtToken(response.token)
            setLoggedIn(!loggedIn)
        }
    }

    useEffect(() => {
        const storeJWT = () => {
            localStorage.setItem('jwt', JSON.stringify(jwtToken))
        }

        storeJWT()
    }, [jwtToken])

    const register = async (e) => {
        e.preventDefault()
        const [response, status] = await registerFetch(username.current.value, password.current.value)
        if (Number(status) === 400) {
            const responseMsg = response.msg
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

    const logout = async (e) => {
        e.preventDefault()

        if (loginMsg !== 'Guest') {
            const response = await logoutFetch(JSON.parse(localStorage.getItem('jwt')))
            setJwtToken('')
            console.log(response)
        }


        setLoggedIn(!loggedIn)
        setLoginMsg('')


        if (setDifficulty) {
            setDifficulty(false)
        }

        if (setKeyColor) {
            setKeyColor({})
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