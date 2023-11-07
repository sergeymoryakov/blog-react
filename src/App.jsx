import { useEffect, useState } from "react";
import "./App.css";
import {
    getActionItems,
    deleteActionItem,
    updateActionItem,
} from "./api/api-methods";
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

    function handleDeleteActionItem(id) {
        console.log("Received command to delete element with ID: ", id);
        setActionItemIds(actionItemIds.filter((itemId) => itemId !== id));
        deleteActionItem(id);
    }

    function handleToggleCheckboxActionItem(id) {
        console.log(
            "Received toggle checkbox command for element with ID: ",
            id
        );

        const actionItem = {
            ...actionItemsById[id],
            completed: !actionItemsById[id].completed,
        };

        setActionItemsById({
            ...actionItemsById,
            [id]: actionItem,
        });

        updateActionItem(actionItem);
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
                            onToggle={() => handleToggleCheckboxActionItem(id)}
                            onDelete={() => handleDeleteActionItem(id)}
                        />
                    ))}
            </ul>
        </div>
    );
}

export default App;
