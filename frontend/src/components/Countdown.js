import React, { useEffect, useState } from "react";

function Countdown({session, reset}) {
    const [clockState, setClockState] = useState();

    useEffect(() => {
        //function to create time diff of session interval and current time every second
        setInterval(() => {
            //current time
            const date = new Date();

            if (session.end) {

                localStorage.setItem('session', JSON.stringify(session))
                //transform set session to calculate time diff
                const refDate = new Date(session.end.replace('GMT', ''))

                //call reset function when time is up
                if (date.getTime() >= refDate.getTime()) {

                    reset()

                }
                const timeDiffSec = Math.floor((refDate.getTime() - date.getTime()) / 10**3)

                const totalDiffMin = Math.floor(timeDiffSec /60)

                const totalDiffHours = Math.floor(totalDiffMin/60)


                const seconds = timeDiffSec - totalDiffMin * 60
                const minutes = Math.floor((timeDiffSec - totalDiffHours * 60 * 60)/60)

                const secAsString = seconds.toString().length < 2 ? '0' + seconds : seconds
                const minAsString = minutes.toString().length < 2 ? '0' + minutes : minutes
                const hourAsString = totalDiffHours.toString().length < 2 ? '0' + totalDiffHours : totalDiffHours

                const timeString = `${hourAsString}:${minAsString}:${secAsString}`

                //call reset function when time is up
                if (timeString === '00:00:00') {
                    console.log(123)
                    reset()
                }

                setClockState(timeString)
            }
        }, 1000);
    }, [session]);

    //set clock color to orange when remaining time smaller than 10 minutes
    return <div className={`countdown {}`} style={clockState < "00:10:00" ? {color: 'var(--sqaure-orange)'}:null}>{clockState}</div>;
}

export default Countdown;


//```import React, { useEffect, useState } from "react";
//
// function Countdown({session}) {
//     const [clockState, setClockState] = useState();
//
//     //function to clear whole app
//     const reset =  () => {
//         localStorage.clear()
//         window.location.reload(false);
//     }
//
//
//     //reset when session changed
//     useEffect(() => {
//         const storedSession = JSON.parse(localStorage.getItem('session'))
//
//         if (storedSession && session) {
//             if (storedSession.start !== session.start || storedSession.end !== session.end) {
//                 reset()
//             }
//         }
//     }, [session])
//
//     useEffect(() => {
//         //function to create time diff of session interval and current time every second
//         setInterval(() => {
//             //current time
//             const date = new Date(Date.now());
//
//             if (session.end) {
//
//                 localStorage.setItem('session', JSON.stringify(session))
//                 //transform set session to calculate time diff
//                 // const refDate = new Date(session.end.replace('GMT', ''))
//
//                 const refDate =  new Date(session.end + '+0200')
//
//                 // const timeDiffSec = Math.floor((refDate.getTime() - date.getTime()) / 10**3)
//                 //
//                 // const totalDiffMin = Math.floor(timeDiffSec /60)
//                 //
//                 // const totalDiffHours = Math.floor(totalDiffMin/60)
//
//
//                 // const seconds = timeDiffSec - totalDiffMin * 60
//                 // const minutes = Math.floor((timeDiffSec - totalDiffHours * 60 * 60)/60)
//                 //
//                 // const secAsString = seconds.toString().length < 2 ? '0' + seconds : seconds
//                 // const minAsString = minutes.toString().length < 2 ? '0' + minutes : minutes
//                 // const hourAsString = totalDiffHours.toString().length < 2 ? '0' + totalDiffHours : totalDiffHours
//
//                 const timeDiff = new Date(refDate - date + 1000)
//
//                 // console.log(timeDiff.getTime())
//
//                 const timeString = timeDiff.toLocaleTimeString('de-DE')
//
//                 //call reset function when time is up
//                 if (date > refDate) {
//                     reset()
//                     // console.log(timeDiff)
//                     // console.log(timeDiff.getTime())
//                 }
//
//                 setClockState(timeString)
//             }
//         }, 1000);
//     }, [session]);
//
//     //set clock color to orange when remaining time smaller than 10 minutes
//     return <div className={`countdown {}`} style={clockState < "00:10:00" ? {color: 'var(--sqaure-orange)'}:null}>{clockState}</div>;
// }
//
// export default Countdown;```