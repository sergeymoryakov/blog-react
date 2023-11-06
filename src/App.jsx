import { useState, useEffect } from "react";
import "./App.css";

const URL_USERS = "https://jsonplaceholder.typicode.com/users";

function App() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    console.log("Component rendered");

    useEffect(() => {
        setIsLoading(true);

        fetch(URL_USERS)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUsers(data);
                setIsLoading(false);
            });
        // .catch(error => console.log(error));
    }, []);

    return (
        <div>
            {isLoading ? "Loading" : ""}
            {JSON.stringify(users)}
        </div>
    );
}

export default App;
