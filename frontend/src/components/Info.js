import React, {useRef, useState} from "react";
import Square from "./Square";

const Info = () => {
    const info = useRef()

    const [display, setDisplay] = useState(false)

    const moveInfoModule = () => {
        const infoModule = info.current

        if (display) {
            infoModule.style.transform = 'translateX(0)'

        } else {
            infoModule.style.transform = 'translateX(95%)'
        }
        setDisplay(!display)
    }

    return (
        <div className={'info'} ref={info}>
            <div className="info-content-container">
                <div className="expand-btn" onClick={moveInfoModule}>
                    <span className="material-symbols-outlined">info</span>
                </div>
                <div className="info-content">
                    <article className={'introduction'}>
                        <p>Try to guess the business related term in the given tries!</p>
                        <p>Each guess must be a valid word. Hit the enter button on your keyboard or screen to submit your guess.</p>
                        <p>After submitting your guess you will receive hints for your given word.</p>
                    </article>
                    <article className={'examples'}>
                        <div className="examples-active">
                            <div className="examples-row">
                                <Square letter={'P'} active={'active'}/>
                                <Square letter={'R'}/>
                                <Square letter={'I'}/>
                                <Square letter={'C'}/>
                                <Square letter={'E'}/>
                            </div>
                            <p>The thick border marks the <span className="underline">current square</span>  where your next letter gets placed.</p>
                        </div><div className="examples-not-in-word">
                            <div className="examples-row">
                                <Square letter={'L'}/>
                                <Square letter={'A'}/>
                                <Square letter={'B'}/>
                                <Square letter={'O'}/>
                                <Square letter={'R'} color={'gray'}/>
                            </div>
                        <p>A gray background tells you that your entered letter is <span className="underline">not in today's solution</span></p>
                        </div>
                        <div className="examples-in-word">
                            <div className="examples-row">
                                <Square letter={'T'}/>
                                <Square letter={'R'}/>
                                <Square letter={'A'} color={'orange'}/>
                                <Square letter={'D'}/>
                                <Square letter={'E'}/>
                            </div>
                            <p>A orange background tells you that your entered letter is <span className="underline">in today's solution</span> <span className="underline">but</span>  not <span className="underline">at the correct position</span> </p>
                        </div><div className="examples-correct">
                            <div className="examples-row">
                                <Square letter={'T'}/>
                                <Square letter={'R'} color={'green'}/>
                                <Square letter={'U'}/>
                                <Square letter={'S'}/>
                                <Square letter={'T'}/>
                            </div>
                            <p>A green background tells you that your entered letter is <span className="underline">in today's solution</span> and already <span className="underline">at the correct position</span> </p>
                        </div>
                    </article>
                    <article className="closing">
                        <p>A new word is randomly chosen each day.</p>
                        <p>Create an account with a fictional name and password to keep track of your performance.</p>
                    </article>
                </div>
            </div>
        </div>
    )
}

export default Info