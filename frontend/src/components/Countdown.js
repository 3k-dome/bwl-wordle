import React, { useEffect, useState } from "react";

function Countdown({session}) {
    const [clockState, setClockState] = useState("--:--:--");

    useEffect(() => {
        setInterval(() => {
            const date = new Date(session);
            const refDate = new Date(`${date.getMonth() + 1} ${date.getDate()}, ${date.getFullYear()} ${date.getTime()}`)
            const timeDiff = new Date(refDate - date)
            setClockState(timeDiff.toLocaleTimeString());
        }, 1000);
    }, []);

    return <div className={"countdown"} style={clockState < "00:10:00" ? {color: "red"}:null}>{clockState}</div>;
}

export default Countdown;