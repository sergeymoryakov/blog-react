import { useState, useEffect } from "react";
import "./App.css";

const URL_USERS = "https://jsonplaceholder.typicode.com/users";

function App() {
    const [users, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    console.log("Component rendered");

    useEffect(() => {
        setIsError(false);
        setIsLoading(true);

        fetch(URL_USERS)
            .then((response) => {
                if (!response.ok) {
                    console.log("Fetch query ERROR", response);
                    throw new Error("Fetch query ERROR");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setUsers(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
                setIsError(true);
            });
    }, []);

    return (
        <div>
            {isError ? "Oops, Error while loading data..." : ""}
            {isLoading ? "Loading" : ""}
            {users ? JSON.stringify(users) : ""}
        </div>
    );
}

export default App;
