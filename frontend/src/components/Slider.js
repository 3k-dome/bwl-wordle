import React,{useRef, useState}from "react";

const Slider = ({stats, difficulties}) => {

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

        Object.values(stats).length > 0 ?
        <div className="statistics-slider">
            <div className="btn-before" onClick={() => moveSlider('back')} ><span className="material-symbols-outlined">chevron_left</span></div>
            <div ref={statsContainer} className="statistics-slider-content">
                {Object.entries(stats).map((stat, index, key) => {
                    return (
                        <div className="statsByDiff" key={index} data-index={index}>
                            <span className="title">{difficulties[stat[0] -1].name}</span>
                            <div className="statistics-content">
                            {Object.entries(stat[1]).map(x => {
                                const word = x[0].replaceAll('_', ' ')
                                return (
                                        <div>
                                            <div className={'metric'}>{word}</div>
                                            <div className='value'>{x[1]}</div>
                                        </div>
                                )
                            })}
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
        </div> : <div style={{textAlign: "center"}}>You must be logged in to see further statistics!</div>
    )
}

export default Slider