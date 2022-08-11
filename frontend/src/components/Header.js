import React, {useRef, useEffect, useState} from "react";
import Countdown from "./Countdown";
import Login from "./Login";

const Header = ({setKeyColor ,jwtToken, setJwtToken ,gameOver, gameOverModal, loggedIn, loginMsg, setLoggedIn, port, setLoginMsg, setDifficulty, leaderboard, displayLeaderboard, setDisplayLeaderboard}) => {

    const changeBtn = useRef();

    const changeColor = () => {

        for (let property in colors) {
            document.documentElement.style.setProperty(property, colors[property][darkMode])
        }
        changeBtn.current.innerHTML = colors['img'][darkMode]
    }

    const colors =
                {
            '--base-bg-color':
                {
                false: 'rgb(224,224,224)',
                true: 'rgb(18,18,19)'
                },
            '--text-color':
                {false: 'rgb(18,18,19)',
                true: 'white'
                },
            '--border-color':
                {
                    false: 'rgb(156,156,156)',
                    true: 'rgb(58,58,60)',
                },
                    '--key-color':
                        {
                            false: 'rgb(129,131,132,0.5)',
                            true: 'rgb(129,131,132,1)'
                        },
                    'img':
                        {
                            false: '<span class="material-symbols-outlined">light_mode</span>',
                            true: '<span class="material-symbols-outlined">dark_mode</span>'
                        },
                    '--square-gray':
                        {
                            false: 'rgba(58, 58, 60, 0.55)',
                            true: 'rgb(58, 58, 60)'
                        },
                    '--sqaure-orange':
                        {
                            false: 'rgba(255,165,0,0.65)',
                            true: 'rgb(255,165,0)'
                        },
                    '--sqaure-green':
                        {
                            false: 'rgba(58,119,53, 0.75)',
                            true: 'rgb(58,119,53)'
                        }

    }


    const [darkMode, setDarkMode] = useState(true)

    const hamburger = useRef()

    const changeLeaderboardDisplay = () => {
        setDisplayLeaderboard(!displayLeaderboard)

        if (displayLeaderboard) {
            hamburger.current.children[1].style.transform = 'scale(1)'

            hamburger.current.children[0].style.transform = 'rotate(0deg)'
            hamburger.current.children[2].style.transform = 'rotate(0deg)'
        } else {
            hamburger.current.children[1].style.transform = 'scale(0)'

            hamburger.current.children[0].style.transform = 'translateY(6.5pt) rotate(45deg) '
            // hamburger.current.children[0].style.transform = ''
            hamburger.current.children[2].style.transform = 'translateY(-6.5pt) rotate(-45deg)'
        }
    }

    useEffect(changeColor, [darkMode])


        return (
            <div className={"header"}>
                {loggedIn ? <div className={`hamburger`} ref={hamburger} onClick={changeLeaderboardDisplay}>
                    <div className={'line'}></div>
                    <div className={'line'}></div>
                    <div className={'line'}></div>
                </div> : null}

                <div className="user">
                    <div style={{display: loggedIn? 'block' : 'none'}}>
                        <Login setKeyColor={setKeyColor} jwtToken={jwtToken} setJwtToken={setJwtToken} setDifficulty={setDifficulty}  loginMsg={loginMsg} setLoginMsg={setLoginMsg} port={port} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
                    </div>

                </div>
                <div className="settings">
                    <div className="color-theme" ref={changeBtn} onClick={() => setDarkMode(!darkMode)}> </div>
                    {gameOver ?<div className="result" onClick={()=>gameOverModal.current.style.display = 'block'}><span className="material-symbols-outlined">leaderboard</span></div> : null}
                </div>
                <div className={'title'}>BWORDLE</div>
                <Countdown/>
            </div>
        )
}

export default Header