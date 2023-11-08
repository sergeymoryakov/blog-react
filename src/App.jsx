import { useEffect, useState } from "react";
import "./App.css";
import {
    getActionItems,
    deleteActionItem,
    updateActionItem,
    addActionItem,
} from "./api/api-methods";
import { v4 as uuidv4 } from "uuid";
import { getNormActionItems } from "./utils/get-norm-items";
import ActionItem from "./components/action-items/Action-item";

function App() {
    const [actionItemIds, setActionItemIds] = useState(null);
    const [actionItemsById, setActionItemsById] = useState();
    const [areActionItemsLoading, setActionItemsLoading] = useState(false);
    const [isLoadingError, setIsLoadingError] = useState(false);
    const [actionItemTitle, setActionItemTitle] = useState("");

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

    function handleInputActionItemTitle(event) {
        setActionItemTitle(event.target.value);
    }

    function handleAddNewActionItem() {
        const id = uuidv4();
        const actionItem = {
            title: actionItemTitle,
            id,
            completed: false,
        };

        setActionItemsById({
            ...actionItemsById,
            [actionItem.id]: actionItem,
        });

        setActionItemIds([actionItem.id, ...actionItemIds]);

        addActionItem(actionItem);
    }

    return (
        <div>
            <h1>Action Items List</h1>

            {isLoadingError && <p>Ooops... Loading Error</p>}

            {areActionItemsLoading && <p>Loading Action Items...</p>}

            <input
                type="text"
                value={actionItemTitle}
                onChange={(event) => handleInputActionItemTitle(event)}
            />

            <button onClick={handleAddNewActionItem}>Add New</button>

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
