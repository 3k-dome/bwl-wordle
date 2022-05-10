import React from "react";
import Countdown from "./Countdown";

const Header = () => {

    const colors =
                {
            '--base-bg-color':
                {
                false: 'rgb(224,224,224)',
                true: 'rgb(18,18,19)'
                },
            '--text-color':
                {
                    false: 'rgb(18,18,19)',
                true: 'white'
                },
            '--border-color':
                {
                    false: 'rgba(58,58,60, 0.2)',
                    true: 'rgba(58,58,60, 1)',
                },
                    '--key-color':
                        {
                            false: 'rgb(129,131,132,0.5)',
                            true: 'rgb(129,131,132,1)'
                        }

    }

    let darkMode = true

    const changeColor = () => {
            darkMode = !darkMode
            for (let property in colors) {
                document.documentElement.style.setProperty(property, colors[property][darkMode])
            }

    }
        return (
            <div className={"header"}>
                <div className="color-theme" onClick={changeColor}></div>
                <div className={'title'}>BWORDLE</div>
                <Countdown/>
            </div>
        )
}

export default Header