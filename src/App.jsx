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
import FormModal from "./components/FormModal/FormModal";

function App() {
    const [blogArticleIds, setBlogArticleIds] = useState(null);

    const [blogArticlesById, setBlogArticlesById] = useState();

    const [processLoading, setProcessLoading] = useState(false);

    const [isLoadingError, setIsLoadingError] = useState(false);

    const [blogArticleTitle, setBlogArticleTitle] = useState("");
    const [blogArticleBody, setBlogArticleBody] = useState("");
    const [blogArticleSource, setBlogArticleSource] = useState("");

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isRecycleBinVisible, setIsRecycleBinVisible] = useState(false);

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

        // Reset the input fields to close the modal form
        setIsFormVisible(false);
    }

    function handleNewArticleEntry() {
        setIsFormVisible(true);
    }

    function handleDisplayRecycleBin() {
        setIsRecycleBinVisible(true);
    }

    return (
        <>
            <div className="header">
                <div className="header_title">
                    <h1>Fake News</h1>
                    {/* <p>by SEPPO.digital</p> */}
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

            {isRecycleBinVisible && (
                <div className="recycle-modal">
                    <FormModal
                        isVisible={isRecycleBinVisible}
                        onClose={() => setIsRecycleBinVisible(false)}
                    >
                        <ul className="recycle-bin-list">
                            {blogArticleIds &&
                                blogArticleIds
                                    .filter(
                                        (id) => blogArticlesById[id].completed
                                    )
                                    .map((id) => (
                                        <BlogArticle
                                            key={id}
                                            blogArticle={blogArticlesById[id]}
                                            onToggle={() =>
                                                handleToggleCheckboxBlogArticle(
                                                    id
                                                )
                                            }
                                            onDelete={() =>
                                                handleDeleteBlogArticle(id)
                                            }
                                        />
                                    ))}
                        </ul>
                    </FormModal>
                </div>
            )}

            {isFormVisible && (
                <div className="form-modal">
                    <FormModal
                        isVisible={isFormVisible}
                        onClose={() => setIsFormVisible(false)}
                    >
                        <form className="form-new-article">
                            <InputField
                                type="text"
                                placeholder="Type Your article title here"
                                value={blogArticleTitle}
                                onChange={(event) =>
                                    handleInputBlogArticleTitle(event)
                                }
                                maxLength={250}
                                required
                                className="title-input"
                            />

                            <InputField
                                type="textarea"
                                placeholder="Type Your article text here"
                                value={blogArticleBody}
                                onChange={(event) =>
                                    handleInputBlogArticleBody(event)
                                }
                                maxLength={3000}
                                required
                                className="body-input"
                            />

                            <InputField
                                type="text"
                                placeholder="Type Your Name (Name S.) here"
                                value={blogArticleSource}
                                onChange={(event) =>
                                    handleInputBlogArticleSource(event)
                                }
                                className="source-input"
                            />

                            <button type="submit" onClick={handleAddNewArticle}>
                                Add New Article
                            </button>
                        </form>
                    </FormModal>
                </div>
            )}

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
                                onDelete={() => handleDeleteBlogArticle(id)}
                            />
                        ))}
            </ul>

            <div className="footer">
                <div className="footer_new-article">
                    <h3>Would you like to share your story?</h3>
                    <button type="submit" onClick={handleNewArticleEntry}>
                        Create
                    </button>
                </div>
                <button type="submit" onClick={handleDisplayRecycleBin}>
                    Display Hidden Articles
                </button>
                <div className="footer_agreement">
                    <h3>Two-Point Agreement</h3>
                    <p>Fake News readers and staff:</p>
                    <p>
                        1) agree that they do not agree with the content and
                        form of some published materials;
                    </p>
                    <p>
                        2) agree that such materials can and should appear here
                        for the sake of completeness.
                    </p>
                </div>
            </div>
        </>
    );
}

export default App;
