import React, { useEffect, useState } from "react";

function Countdown() {
    const [clockState, setClockState] = useState("--:--:--");

    useEffect(() => {
        setInterval(() => {
            const date = new Date();
            const refDate = new Date(`${date.getMonth() + 1} ${date.getDate()}, ${date.getFullYear()} 22:59:59`)
            const timeDiff = new Date(refDate - date)
            setClockState(timeDiff.toLocaleTimeString());
        }, 1000);
    }, []);

    return <div className={"countdown"} style={clockState < "00:10:00" ? {color: "red"}:null}>{clockState}</div>;
}

export default Countdown;