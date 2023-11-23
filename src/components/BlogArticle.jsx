function BlogArticle({ blogArticle, onToggle, onDelete }) {
    return (
        <li>
            {" "}
            <p>{blogArticle.title}</p>
            <p>{blogArticle.body}</p>
            <p>{blogArticle.source}</p>
            {/* <p>{blogArticle.date}</p> */}
            <input
                type="checkbox"
                checked={blogArticle.completed}
                onChange={onToggle}
            />
            <button onClick={onDelete}>Delete</button>
        </li>
    );
}
export default BlogArticle;
