import React, { useEffect, useState } from "react";

function Countdown({session, port}) {
    const [clockState, setClockState] = useState();

    const altPort = port.replace('/api','')

    const reset = async () => {
        const response = await fetch(altPort + '/debug/set_word')
        window.location.reload(false);
    }

    useEffect(() => {
        setInterval(() => {
            const date = new Date();

            if (session) {
                const refDate = new Date(session.replace('GMT', ''))

                const timeDiffSec = Math.floor((refDate.getTime() - date.getTime()) / 10**3)

                const totalDiffMin = Math.floor(timeDiffSec /60)

                const totalDiffHours = Math.floor(totalDiffMin/60)


                const seconds = timeDiffSec - totalDiffMin * 60
                const minutes = Math.floor((timeDiffSec - totalDiffHours * 60 * 60)/60)

                const secAsString = seconds.toString().length < 2 ? '0' + seconds : seconds
                const minAsString = minutes.toString().length < 2 ? '0' + minutes : minutes
                const hourAsString = totalDiffHours.toString().length < 2 ? '0' + totalDiffHours : totalDiffHours

                const timeString = `${hourAsString}:${minAsString}:${secAsString}`

                if (timeString === '00:00:00') {

                    reset()

                    console.log('reload')
                }

                setClockState(timeString)
            }
        }, 1000);
    }, [session]);

    return <div className={`countdown {}`} style={clockState < "00:10:00" ? {color: 'var(--sqaure-orange)'}:null}>{clockState}</div>;
}

export default Countdown;