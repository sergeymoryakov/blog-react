import { useState, useEffect } from "react";
import "./App.css";

const URL_USERS = "https://jsonplaceholder.typicode.com/users";

function App() {
    const [users, setUsers] = useState([]);

    console.log("Component rendered");

    useEffect(() => {
        fetch(URL_USERS)
            .then((response) => response.json())

            .then((data) => {
                console.log(data);
                setUsers(data);
            });

        // .catch(error => console.log(error));
    }, []);

    return <div>{JSON.stringify(users)}</div>;
}

export default App;
