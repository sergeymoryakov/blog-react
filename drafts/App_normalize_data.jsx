import { useEffect, useState } from "react";
import "./App.css";
import { getActionItems } from "../src/api/action-item";
import { getNormActionItems } from "../src/utils/get-norm-items";

// const API_URL_ACTION_ITEMS = "https://jsonplaceholder.typicode.com/todos";

// const mockActionItems = [
//     {
//         userId: 1,
//         id: 1,
//         title: "delectus aut autem",
//         completed: false,
//     },
//     {
//         userId: 1,
//         id: 2,
//         title: "quis ut nam facilis et officia qui",
//         completed: false,
//     },
//     {
//         userId: 1,
//         id: 3,
//         title: "fugiat veniam minus",
//         completed: false,
//     },
// ];

// const mockActionItemsId = [1, 2, 3, 4, 5];
// const mockActionItemsById = {
//     1: {
//         userId: 1,
//         id: 1,
//         title: "delectus aut autem",
//         completed: false,
//     },
//     2: {
//         userId: 1,
//         id: 2,
//         title: "quis ut nam facilis et officia qui",
//         completed: false,
//     },
//     3: {
//         userId: 1,
//         id: 3,
//         title: "fugiat veniam minus",
//         completed: false,
//     },
// };

function App() {
    const [actionItemIds, setActionItemIds] = useState(null);
    const [actionItemsById, setActionItemsById] = useState();
    const [areActionItemsLoading, setActionItemsLoading] = useState(false);
    const [isLoadingError, setIsLoadingError] = useState(false);

    useEffect(() => {
        setIsLoadingError(false);
        setActionItemsLoading(true);

        getActionItems()
            .then((actionItems) => {
                const [ids, byId] = getNormActionItems(actionItems);

                setActionItemsLoading(false);
                setActionItemIds(ids);
                setActionItemsById(byId);
            })
            .catch(() => {
                setIsLoadingError(true);
                setActionItemsLoading(false);
            });
    }, []);

    return (
        <div>
            <h1>Action Items List</h1>

            {isLoadingError && <p>Ooops... Loading Error</p>}

            {areActionItemsLoading && <p>Loading Action Items...</p>}

            <ul className="action-items-list">
                {actionItemIds &&
                    actionItemIds.map((id) => (
                        <li key={id}>{actionItemsById[id].title}</li>
                    ))}
            </ul>
        </div>
    );
}

export default App;
