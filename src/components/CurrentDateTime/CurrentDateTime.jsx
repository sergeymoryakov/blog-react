import React, { useEffect, useState } from "react";

function CurrentDateTime() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // initialize the side effects for current time:
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000); // 1000 ms = 1 second

        // this will clear Timeout when component unmounts
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <p>{currentDateTime.toLocaleDateString()}</p>
            <p>{currentDateTime.toLocaleTimeString()}</p>
        </>
    );
}

export default CurrentDateTime;
