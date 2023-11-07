import { useEffect, useState } from "react";
import "./App.css";
import { getActionItems } from "./api/action-item";
import { getNormActionItems } from "./utils/get-norm-items";
import ActionItem from "./components/action-items/Action-item";

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

    function handleDeleteActionItemBtnClick(id) {
        console.log("Received command to delete element with ID: ", id);
    }

    return (
        <div>
            <h1>Action Items List</h1>

            {isLoadingError && <p>Ooops... Loading Error</p>}

            {areActionItemsLoading && <p>Loading Action Items...</p>}

            <ul className="action-items-list">
                {actionItemIds &&
                    actionItemIds.map((id) => (
                        <ActionItem
                            key={id}
                            actionItem={actionItemsById[id]}
                            onDeleteBtnClick={() =>
                                handleDeleteActionItemBtnClick(id)
                            }
                        />
                    ))}
            </ul>
        </div>
    );
}

export default App;
