import { useEffect, useState } from "react";
import "./App.css";

const mockActionItems = [
    {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false,
    },
    {
        userId: 1,
        id: 2,
        title: "quis ut nam facilis et officia qui",
        completed: false,
    },
    {
        userId: 1,
        id: 3,
        title: "fugiat veniam minus",
        completed: false,
    },
];

function App() {
    const [actionItems, setActionItems] = useState(null);
    const [areActionItemsLoading, setActionItemsLoading] = useState(false);
    const [isLoadingError, setLoadingError] = useState(false);

    useEffect(() => {
        setLoadingError(false);
        setActionItemsLoading(true);
        setActionItems(mockActionItems);
        setActionItemsLoading(false);
    }, []);

    return (
        <div>
            <h1>Action Items List</h1>

            {isLoadingError && <p>Ooops... Loading Error</p>}

            {areActionItemsLoading && <p>Loading Action Items...</p>}

            <ul>
                {actionItems &&
                    actionItems.map((item) => (
                        <li key={item.id}>{item.title}</li>
                    ))}
            </ul>
        </div>
    );
}

export default App;
