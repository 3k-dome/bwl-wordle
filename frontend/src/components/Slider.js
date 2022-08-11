import React,{useRef, useState, useEffect}from "react";

const Slider = ({stats}) => {

    const statsContainer = useRef()
    const sliderDots = useRef()

    const [currPos, setCurrPos] = useState(0)

    const moveSlider = (direction) => {

        const length = Object.keys(stats).length

        statsContainer.current.scroll({
            top: 0,
            left: direction === 'forward' ? (currPos +1) * statsContainer.current.children[0].offsetWidth : (currPos -1) * statsContainer.current.children[0].offsetWidth ,
            behavior: 'smooth'
        })

        if (currPos < length-1) {
            setCurrPos(direction === 'forward' ? currPos + 1 : currPos-1)
        } else {
            setCurrPos(0)
        }



    }

    return (
        <div className="statistics-slider">
            <div className="btn-before" onClick={() => moveSlider('back')} ><span className="material-symbols-outlined">chevron_left</span></div>
            <div ref={statsContainer} className="statistics-slider-content">
                {Object.entries(stats).map((stat, index) => {
                    return (
                        <div className="totalStats" key={index} data-index={index}>
                            <span className="title">{stat[0]}</span>
                            <div className="statistics-content">
                                <div className="hit-rate-container">
                                    <span>Hit rate</span>
                                    <div className="value">{stat[1].hitrate}</div>
                                </div>
                                <div className="success-rate-container">
                                    <span>Success rate</span>
                                    <div className="value">{stat[1].successrate}</div>
                                </div>
                                <div className="total-score-container">
                                    <span>Total score</span>
                                    <div className="value">{stat[1].totalscore}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="btn-after" onClick={() => moveSlider('forward')}><span className="material-symbols-outlined">chevron_right</span></div>
            <div ref={sliderDots} className="statistics-slider-dots">
                {Object.entries(stats).map((stat, index) => {
                   return (
                       currPos === index ? <div className={"dot active"} key={index}></div> : <div className={"dot"} key={index}></div>
                   )

                })
                }
            </div>
        </div>
    )
}

export default Slider