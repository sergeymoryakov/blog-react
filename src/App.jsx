import { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    console.log("Component rendered");

    useEffect(() => {
        console.log("Call useEffect");
        localStorage.setItem("count", count);
    }, [count]);

    // function handleButtonClick() {
    //     localStorage.setItem("count", count);
    //     setCount(count + 1);
    // }

    return (
        <div>
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>Count++</button>
            {/* <button onClick={handleButtonClick}>Count++</button> */}
        </div>
    );
}

export default App;
