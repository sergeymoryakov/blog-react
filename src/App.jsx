import { useEffect, useState } from "react";
import "./App.css";
import { getItemsFromFirestore } from "./api/api-functions";
import {
    getActionItems,
    deleteActionItem,
    updateActionItem,
    addActionItem,
} from "./api/api-methods";
import { v4 as uuidv4 } from "uuid";
import {
    getNormActionItems,
    getNormBlogArticles,
} from "./utils/get-norm-items";

import { COLLECTION_NAME } from "./config/firebase-config";

import BlogArticle from "./components/BlogArticle";
import ActionItem from "./components/action-items/Action-item";

function App() {
    const [blogArticleIds, setBlogArticleIds] = useState(null); // New: Array of IDs
    const [actionItemIds, setActionItemIds] = useState(null);

    const [blogArticlesById, setBlogArticlesById] = useState(); // New: Object of items by ID
    const [actionItemsById, setActionItemsById] = useState();

    const [processLoading, setProcessLoading] = useState(false);

    const [isLoadingError, setIsLoadingError] = useState(false);

    const [actionItemTitle, setActionItemTitle] = useState("");

    useEffect(() => {
        setIsLoadingError(false);
        setProcessLoading(true);

        getItemsFromFirestore(COLLECTION_NAME)
            .then((blogArticles) => {
                const [ids, byId] = getNormBlogArticles(blogArticles);

                setProcessLoading(false);
                setBlogArticleIds(ids);
                setBlogArticlesById(byId);
            })
            .catch(() => {
                setIsLoadingError(true);
                setProcessLoading(false);
            });

        // getActionItems()
        //     .then((actionItems) => {
        //         const [ids, byId] = getNormActionItems(actionItems);

        //         setProcessLoading(false);
        //         setActionItemIds(ids);
        //         setActionItemsById(byId);
        //     })
        //     .catch(() => {
        //         setIsLoadingError(true);
        //         setProcessLoading(false);
        //     });
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
            <h1>Funny Blog</h1>

            {isLoadingError && <p>Ooops... Loading Error</p>}

            {processLoading && <p>Loading Action Items...</p>}

            <input
                type="text"
                value={actionItemTitle}
                onChange={(event) => handleInputActionItemTitle(event)}
            />

            <button onClick={handleAddNewActionItem}>Add New</button>

            <ul className="action-items-list">
                {blogArticleIds &&
                    blogArticleIds.map((id) => (
                        <BlogArticle
                            key={id}
                            blogArticle={blogArticlesById[id]}
                            onToggle={() => handleToggleCheckboxActionItem(id)}
                            onDelete={() => handleDeleteActionItem(id)}
                        />
                    ))}
                {
                    // actionItemIds &&
                    //  actionItemIds.map((id) => (
                    // <ActionItem
                    //     key={id}
                    //     actionItem={actionItemsById[id]}
                    //     onToggle={() => handleToggleCheckboxActionItem(id)}
                    //     onDelete={() => handleDeleteActionItem(id)}
                    // />
                    // ))
                }
            </ul>
        </div>
    );
}

export default App;
