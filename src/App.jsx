import { useEffect, useState } from "react";
import "./App.css";
import {
    getItemsFromFirestore,
    addItemToFirestore,
    updateItemInFirestore,
    deleteItemFromFireStore,
} from "./api/api-functions";
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

    const [blogArticleTitle, setBlogArticleTitle] = useState(""); // New: State for input value
    const [blogArticleBody, setBlogArticleBody] = useState(""); // New: State for input value
    const [blogArticleSource, setBlogArticleSource] = useState(""); // New: State for input value
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

    // Handling the new blog title input
    function handleInputBlogArticleTitle(event) {
        setBlogArticleTitle(event.target.value);
        console.log("Title: ", event.target.value);
    }

    // Handling the new blog body text input
    function handleInputBlogArticleBody(event) {
        setBlogArticleBody(event.target.value);
        console.log("Body: ", event.target.value);
    }

    // Handling the new blog source input
    function handleInputBlogArticleSource(event) {
        setBlogArticleSource(event.target.value);
        console.log("Source: ", event.target.value);
    }

    // function handleInputActionItemTitle(event) {
    //     setActionItemTitle(event.target.value);
    // }

    function handleAddNewArticle(event) {
        event.preventDefault(); // prevent the form from submitting

        // For test purposes, remove in production
        console.log("handleAddNewArticle() has been called.");

        const id = uuidv4();
        const blogArticle = {
            title: blogArticleTitle,
            body: blogArticleBody,
            source: blogArticleSource,
            id,
            completed: false,
        };

        setBlogArticlesById({
            ...blogArticlesById,
            [blogArticle.id]: blogArticle,
        });

        setBlogArticleIds([blogArticle.id, ...blogArticleIds]);

        // Displey newly created blog article to console
        console.log("blogArticle: ", blogArticle);

        // am about to use the function addItemToFirestore() from api-functions.jsx
        console.log("addItemToFirestore() is about to be called.");

        addItemToFirestore(blogArticle);
    }

    // function handleAddNewActionItem() {
    //     const id = uuidv4();
    //     const actionItem = {
    //         title: actionItemTitle,
    //         id,
    //         completed: false,
    //     };

    //     setActionItemsById({
    //         ...actionItemsById,
    //         [actionItem.id]: actionItem,
    //     });

    //     setActionItemIds([actionItem.id, ...actionItemIds]);

    //     addActionItem(actionItem);
    // }

    return (
        <div>
            <h1>Funny Blog</h1>

            {isLoadingError && <p>Ooops... Loading Error</p>}

            {processLoading && <p>Loading Action Items...</p>}

            <form className="form-new-blog">
                <input
                    type="text"
                    placeholder="Type Your article title here"
                    value={blogArticleTitle}
                    onChange={(event) => handleInputBlogArticleTitle(event)}
                />

                <input
                    type="text"
                    placeholder="Type Your article text here"
                    value={blogArticleBody}
                    onChange={(event) => handleInputBlogArticleBody(event)}
                />
                <input
                    type="text"
                    placeholder="Type Your Name (Name S.) here"
                    value={blogArticleSource}
                    onChange={(event) => handleInputBlogArticleSource(event)}
                />

                <button type="submit" onClick={handleAddNewArticle}>
                    Add New Article
                </button>
                {/* <button onClick={handleAddNewActionItem}>Add New</button> */}
            </form>

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
            </ul>
        </div>
    );
}

export default App;
