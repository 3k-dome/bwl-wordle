import React,{useRef, useState}from "react";

const Slider = ({stats}) => {

    const statsContainer = useRef()

    const [currPos, setCurrPos] = useState(0)

    const moveSlider = (direction) => {

        const length = Object.keys(stats).length

        const pos = currPos

        statsContainer.current.scroll({
            top: 0,
            left: direction === 'forward' ? (pos+1) * statsContainer.current.children[0].offsetWidth : (pos -1) * statsContainer.current.children[0].offsetWidth ,
            behavior: 'smooth'
        })


        if (direction === 'forward') {
            if (pos < length -1) {
                setCurrPos(pos + 1)
            } else {
                setCurrPos(pos - length + 1)
                statsContainer.current.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                })
            }
        } else {
            if (pos > 0) {
                setCurrPos(pos - 1)
            } else {
                setCurrPos(length - 1)
                statsContainer.current.scroll({
                    top: 0,
                    left: length * statsContainer.current.children[0].offsetWidth,
                    behavior: 'smooth'
                })
            }
        }





    }

    return (
        <div className="statistics-slider">
            <div className="btn-before" onClick={() => moveSlider('back')} ><span className="material-symbols-outlined">chevron_left</span></div>
            <div ref={statsContainer} className="statistics-slider-content">
                {Object.entries(stats).map((stat, index) => {
                    return (
                        <div className="statsByDiff" key={index} data-index={index}>
                            <span className="title">{stat[0]}</span>
                            <div className="statistics-content">
                                <div className="avg-tries-container">
                                    <div className={'metric'}>Average taken tries</div>
                                    <div className={Number(stat[1].avg_taken_tries) < 6 ? "value orange" : "value green"}>{stat[1].avg_taken_tries}</div>
                                </div>
                                <div className="hit-rate-container">
                                    <div className={'metric'}>Hit rate</div>
                                    <div className={Number(stat[1].hitrate) < 0.5 ? "value orange" : "value green"}>{stat[1].hitrate}</div>
                                </div>
                                <div className="played-container">
                                    <div className={'metric'}>games played</div>
                                    <div className={"value key-color"}>{stat[1].played}</div>
                                </div>
                                <div className="won-container">
                                    <div className={'metric'}>games won</div>
                                    <div className="value key-color">{stat[1].won}</div>
                                </div>
                                <div className="success-rate-container">
                                    <div className={'metric'}>Success rate</div>
                                    <div className={Number(stat[1].successrate) < 0.5 ? "value orange" : "value green"}>{stat[1].successrate}</div>
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="btn-after" onClick={() => moveSlider('forward')}><span className="material-symbols-outlined">chevron_right</span></div>
            <div className="statistics-slider-dots">
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