import { useEffect, useState } from "react";
import "./App.css";
import {
    getItemsFromFirestore,
    addItemToFirestore,
    updateItemInFirestore,
    deleteItemFromFireStore,
} from "./api/api-functions";

// import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { getNormBlogArticles } from "./utils/get-norm-items";

import { COLLECTION_NAME } from "./config/firebase-config";

import InputField from "./components/InputField/InputField";
import BlogArticle from "./components/BlogArticle";

function App() {
    const [blogArticleIds, setBlogArticleIds] = useState(null); // New: Array of IDs

    const [blogArticlesById, setBlogArticlesById] = useState(); // New: Object of items by ID

    const [processLoading, setProcessLoading] = useState(false);

    const [isLoadingError, setIsLoadingError] = useState(false);

    const [blogArticleTitle, setBlogArticleTitle] = useState(""); // New: State for input value
    const [blogArticleBody, setBlogArticleBody] = useState(""); // New: State for input value
    const [blogArticleSource, setBlogArticleSource] = useState(""); // New: State for input value

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
    }, []);

    function handleDeleteBlogArticle(id) {
        console.log("Received command to delete element with ID: ", id);
        setBlogArticleIds(blogArticleIds.filter((itemId) => itemId !== id));
        deleteItemFromFireStore(id);
    }

    function handleToggleCheckboxBlogArticle(id) {
        console.log(
            "Received toggle checkbox command for element with ID: ",
            id
        );

        const blogArticle = {
            ...blogArticlesById[id],
            completed: !blogArticlesById[id].completed,
        };

        setBlogArticlesById({
            ...blogArticlesById,
            [id]: blogArticle,
        });

        updateItemInFirestore(blogArticle.id, {
            completed: blogArticle.completed,
        });
    }

    // Handling the new blog title input
    function handleInputBlogArticleTitle(event) {
        setBlogArticleTitle(event.target.value);
    }

    // Handling the new blog body text input
    function handleInputBlogArticleBody(event) {
        setBlogArticleBody(event.target.value);
    }

    // Handling the new blog source input
    function handleInputBlogArticleSource(event) {
        setBlogArticleSource(event.target.value);
    }

    function handleAddNewArticle(event) {
        event.preventDefault(); // prevent the form from submitting

        const id = uuidv4();
        // add the current date and time:
        const date = new Date();
        const blogArticle = {
            title: blogArticleTitle,
            body: blogArticleBody,
            source: blogArticleSource,
            id,
            completed: false,
            date,
        };

        setBlogArticlesById({
            ...blogArticlesById,
            [blogArticle.id]: blogArticle,
        });

        setBlogArticleIds([blogArticle.id, ...blogArticleIds]);

        addItemToFirestore(blogArticle);
    }

    function handleNewArticleEntry() {
        // setBlogArticleTitle("");
        // setBlogArticleBody("");
        // setBlogArticleSource("");
    }

    return (
        <div>
            <h1>Fake Digital News Blog</h1>

            {isLoadingError && <p>Ooops... Loading Error</p>}

            {processLoading && <p>Loading Action Items...</p>}

            <form className="form-new-blog">
                <InputField
                    type="text"
                    placeholder="Type Your article title here"
                    value={blogArticleTitle}
                    onChange={(event) => handleInputBlogArticleTitle(event)}
                    maxLength={250}
                    required
                    className="title-input"
                />

                <InputField
                    type="textarea"
                    placeholder="Type Your article text here"
                    value={blogArticleBody}
                    onChange={(event) => handleInputBlogArticleBody(event)}
                    maxLength={3000}
                    required
                    className="body-input"
                />

                <InputField
                    type="text"
                    placeholder="Type Your Name (Name S.) here"
                    value={blogArticleSource}
                    onChange={(event) => handleInputBlogArticleSource(event)}
                    className="source-input"
                />

                <button type="submit" onClick={handleAddNewArticle}>
                    Add New Article
                </button>
            </form>

            <h2>Like to add a new article?</h2>
            <button type="submit" onClick={handleNewArticleEntry}>
                Add New Article
            </button>

            <ul className="action-items-list">
                {blogArticleIds &&
                    blogArticleIds.map((id) => (
                        <BlogArticle
                            key={id}
                            blogArticle={blogArticlesById[id]}
                            onToggle={() => handleToggleCheckboxBlogArticle(id)}
                            onDelete={() => handleDeleteBlogArticle(id)}
                        />
                    ))}
            </ul>
        </div>
    );
}

export default App;
