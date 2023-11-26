import { useEffect, useState } from "react";
import "./App.css";
import {
    getItemsFromFirestore,
    addItemToFirestore,
    updateItemInFirestore,
    deleteItemFromFireStore,
} from "./api/api-functions";

import { v4 as uuidv4 } from "uuid";
import { getNormBlogArticles } from "./utils/get-norm-items";

import { COLLECTION_NAME } from "./config/firebase-config";

import InputField from "./components/InputField/InputField";
import BlogArticle from "./components/BlogArticle/BlogArticle";
import BlogArticleAdmin from "./components/BlogArticle/BlogArticleAdmin";

function App() {
    const [blogArticleIds, setBlogArticleIds] = useState(null);

    const [blogArticlesById, setBlogArticlesById] = useState();

    const [processLoading, setProcessLoading] = useState(false);

    const [isLoadingError, setIsLoadingError] = useState(false);

    const [blogArticleTitle, setBlogArticleTitle] = useState("");
    const [blogArticleBody, setBlogArticleBody] = useState("");
    const [blogArticleSource, setBlogArticleSource] = useState("");

    const [isAdminMode, setIsAdminMode] = useState(false);

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
        if (!window.confirm("Are you sure you want to delete this article?")) {
            return;
        }
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

        // check if the input fields are empty:
        if (
            blogArticleTitle.trim() === "" ||
            blogArticleBody.trim() === "" ||
            blogArticleSource.trim() === ""
        ) {
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

    function toggleAdminMode() {
        setIsAdminMode(!isAdminMode);
    }

    return (
        <>
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
                    <p>date now</p>
                    <p>time now</p>
                </div>
            </div>

            {isLoadingError && <p>Ooops... Loading Error</p>}

            {processLoading && <p>Loading Action Items...</p>}

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
                    <h3>Add New Article</h3>
                    <form className="form-new-article">
                        <InputField
                            type="text"
                            placeholder="Type article title (10 to 250 characters)"
                            value={blogArticleTitle}
                            onChange={(event) =>
                                handleInputBlogArticleTitle(event)
                            }
                            maxLength={250}
                            // required
                            className="title-input"
                        />

                        <InputField
                            type="textarea"
                            placeholder="Type article text here (100 to 2,500 characters)"
                            value={blogArticleBody}
                            onChange={(event) =>
                                handleInputBlogArticleBody(event)
                            }
                            maxLength={2500}
                            // required
                            className="body-input"
                        />

                        <InputField
                            type="text"
                            placeholder="Type your name here (3 to 50 characters)"
                            value={blogArticleSource}
                            onChange={(event) =>
                                handleInputBlogArticleSource(event)
                            }
                            className="source-input"
                        />

                        <button type="submit" onClick={handleAddNewArticle}>
                            Add Article
                        </button>
                    </form>
                    <h3>Articles Administration</h3>
                    <ul className="list-blog-articles">
                        {blogArticleIds &&
                            blogArticleIds
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
