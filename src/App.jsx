import React from "react";
import { useEffect, useState } from "react";

import {
    getItemsFromFirestore,
    addItemToFirestore,
    updateItemInFirestore,
    deleteItemFromFireStore,
} from "./api/api-functions";
import { COLLECTION_NAME } from "./config/firebase-config";

import { v4 as uuidv4 } from "uuid";
import { getNormBlogArticles } from "./utils/get-norm-items";

import InputField from "./components/InputField/InputField";
import BlogArticle from "./components/BlogArticle/BlogArticle";
import BlogArticleAdmin from "./components/BlogArticle/BlogArticleAdmin";
import SpanError from "./components/SpanError/SpanError";

import {
    LIMIT_TITLE_MIN,
    LIMIT_TITLE_MAX,
    LIMIT_BODY_MIN,
    LIMIT_BODY_MAX,
    LIMIT_SOURCE_MIN,
    LIMIT_SOURCE_MAX,
    ERROR_TITLE_LENGTH_MIN,
    ERROR_TITLE_LENGTH_MAX,
    ERROR_BODY_LENGTH_MIN,
    ERROR_BODY_LENGTH_MAX,
    ERROR_SOURCE_LENGTH_MIN,
    ERROR_SOURCE_LENGTH_MAX,
} from "./config/constants";

import "./App.css";

function App() {
    // initialize the state variables:
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [processLoading, setProcessLoading] = useState(false);
    const [isLoadingError, setIsLoadingError] = useState(false);

    const [blogArticleIds, setBlogArticleIds] = useState(null);
    const [blogArticlesById, setBlogArticlesById] = useState();

    const [isAdminMode, setIsAdminMode] = useState(false);

    const [blogArticleTitle, setBlogArticleTitle] = useState("");
    const [blogArticleBody, setBlogArticleBody] = useState("");
    const [blogArticleSource, setBlogArticleSource] = useState("");

    const [titleError, setTitleError] = useState("");
    const [bodyError, setBodyError] = useState("");
    const [sourceError, setSourceError] = useState("");

    // initialize the side effects for current time:
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000); // 1000 ms = 1 second

        // this will clear Timeout
        return () => clearInterval(timer);
    }, []);

    // initialize the side effects for loading the blog articles from Firestore:
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

    // Handling the toggle admin mode button click
    function toggleAdminMode() {
        setIsAdminMode(!isAdminMode);
    }

    // Handling the new blog title input
    function handleInputBlogArticleTitle(event) {
        const { value } = event.target;
        console.log("Received input: ", value);

        if (value.length < LIMIT_TITLE_MIN) {
            setTitleError(ERROR_TITLE_LENGTH_MIN);
        } else if (value.length > LIMIT_TITLE_MAX) {
            setTitleError(ERROR_TITLE_LENGTH_MAX);
        } else {
            setTitleError("");
        }

        setBlogArticleTitle(value);
    }

    // Handling the new blog body text input
    function handleInputBlogArticleBody(event) {
        const { value } = event.target;
        console.log("Received input: ", value);

        if (value.length < LIMIT_BODY_MIN) {
            setBodyError(ERROR_BODY_LENGTH_MIN);
        } else if (value.length > LIMIT_BODY_MAX) {
            setBodyError(ERROR_BODY_LENGTH_MAX);
        } else {
            setBodyError("");
        }

        setBlogArticleBody(value);
    }

    // Handling the new blog source input
    function handleInputBlogArticleSource(event) {
        const { value } = event.target;
        console.log("Received input: ", value);

        if (value.length < LIMIT_SOURCE_MIN) {
            setSourceError(ERROR_SOURCE_LENGTH_MIN);
        } else if (value.length > LIMIT_SOURCE_MAX) {
            setSourceError(ERROR_SOURCE_LENGTH_MAX);
        } else {
            setSourceError("");
        }
        setBlogArticleSource(event.target.value);
    }

    // Handling the add new article button click
    function handleAddNewArticle(event) {
        event.preventDefault(); // prevent the form from submitting

        // check if the input fields are empty:
        if (titleError !== "" || bodyError !== "" || sourceError !== "") {
            alert("Please fill in all the fields");
            return;
        }

        // generate a new ID:
        const id = uuidv4();

        // add the current date and time:
        const date = new Date();
        const blogArticle = {
            title: blogArticleTitle.trim(),
            body: blogArticleBody.trim(),
            source: blogArticleSource.trim(),
            id,
            completed: false,
            date,
        };

        // add the new blog article to the list of blog articles:
        setBlogArticlesById({
            ...blogArticlesById,
            [blogArticle.id]: blogArticle,
        });

        // add the new blog article to the list of blog article IDs:
        setBlogArticleIds([blogArticle.id, ...blogArticleIds]);

        // add the new blog article to the Firestore:
        addItemToFirestore(blogArticle);

        // reset the input fields:
        setBlogArticleTitle("");
        setBlogArticleBody("");
        setBlogArticleSource("");
    }

    // Handling the delete button click in admin mode
    function handleDeleteBlogArticle(id) {
        console.log("Received command to delete element with ID: ", id);
        if (!window.confirm("Are you sure you want to delete this article?")) {
            return;
        }
        setBlogArticleIds(blogArticleIds.filter((itemId) => itemId !== id));
        deleteItemFromFireStore(id);
    }

    // Handling the hide checkbox toggle in admin mode
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

    return (
        <>
            {/* header section */}
            <div className="header">
                <div className="header_title">
                    <h1>Fake News</h1>
                    <a
                        href="https://sergeymoryakov.github.io/seppo-digital/"
                        target="_blank"
                    >
                        by SEPPO.digital
                    </a>
                </div>
                <div className="header_date">
                    <p>{currentDateTime.toLocaleDateString()}</p>
                    <p>{currentDateTime.toLocaleTimeString()}</p>
                </div>
            </div>

            {/* spinners and alerts section */}
            {isLoadingError && <p>Ooops... Loading Error</p>}

            {processLoading && <p>Loading Action Items...</p>}

            {/* articles list section */}
            {!isAdminMode && (
                <>
                    <ul className="list-blog-articles">
                        {blogArticleIds &&
                            blogArticleIds
                                .filter((id) => !blogArticlesById[id].completed)
                                .map((id) => (
                                    <BlogArticle
                                        key={id}
                                        blogArticle={blogArticlesById[id]}
                                        onToggle={() =>
                                            handleToggleCheckboxBlogArticle(id)
                                        }
                                        onDelete={() =>
                                            handleDeleteBlogArticle(id)
                                        }
                                    />
                                ))}
                    </ul>
                    <div className="admin-mode-entry">
                        <h3>Would you like to share your story?</h3>
                        <button onClick={toggleAdminMode}>
                            Access Admin Mode
                        </button>
                    </div>
                </>
            )}

            {isAdminMode && (
                <>
                    {/* admin new input section */}
                    <h3>Add New Article</h3>
                    <form className="form-new-article">
                        <div className="input-wrapper">
                            <InputField
                                type="text"
                                placeholder="Type article title (10 to 250 characters)"
                                value={blogArticleTitle}
                                onChange={(event) =>
                                    handleInputBlogArticleTitle(event)
                                }
                                className="input-field"
                            />
                            <SpanError
                                className="input-error"
                                errorMessage={titleError}
                            ></SpanError>
                        </div>

                        <div className="input-wrapper">
                            <InputField
                                type="textarea"
                                placeholder="Type article text here (100 to 2,500 characters)"
                                value={blogArticleBody}
                                onChange={(event) =>
                                    handleInputBlogArticleBody(event)
                                }
                                className="input-field"
                            />
                            <SpanError
                                className="input-error"
                                errorMessage={bodyError}
                            ></SpanError>
                        </div>

                        <div className="input-wrapper">
                            <InputField
                                type="text"
                                placeholder="Type your name here (3 to 50 characters)"
                                value={blogArticleSource}
                                onChange={(event) =>
                                    handleInputBlogArticleSource(event)
                                }
                                className="input-field"
                            />
                            <SpanError
                                className="input-error"
                                errorMessage={sourceError}
                            ></SpanError>
                        </div>

                        <button type="submit" onClick={handleAddNewArticle}>
                            Add Article
                        </button>
                    </form>

                    {/* admin articles list section */}
                    <h3>Articles Administration</h3>
                    <ul className="list-blog-articles">
                        {blogArticleIds &&
                            blogArticleIds
                                // possible option - filter by completed status:
                                // .filter((id) => !blogArticlesById[id].completed)
                                .map((id) => (
                                    <BlogArticleAdmin
                                        key={id}
                                        blogArticle={blogArticlesById[id]}
                                        onToggle={() =>
                                            handleToggleCheckboxBlogArticle(id)
                                        }
                                        onDelete={() =>
                                            handleDeleteBlogArticle(id)
                                        }
                                    />
                                ))}
                    </ul>
                    <div className="user-mode-entry">
                        <h3>Back to User mode?</h3>
                        <button onClick={toggleAdminMode}>
                            Back to User Mode
                        </button>
                    </div>
                </>
            )}

            {/* footer section */}
            <div className="footer">
                <div className="footer_agreement">
                    <h3>Agreement of Disagreement</h3>
                    <p>Users and creators of the Fake News:</p>
                    <p>
                        a) agree that they disagree with the way how some media
                        depict some events, which may be inappropriate and even
                        offensive,
                    </p>
                    <p>
                        b) agree that such a content must be present here for
                        the sake of comprehensiveness.
                    </p>
                </div>
            </div>
        </>
    );
}

export default App;
