import { format } from "date-fns";

function BlogArticle({ blogArticle, onToggle, onDelete }) {
    const dateObject =
        blogArticle.date instanceof Date
            ? blogArticle.date
            : blogArticle.date.toDate();

    // Option 1: Format the date using date-fns:
    const date = format(dateObject, "yyyy-MM-dd HH:mm:ss");

    // Option 2: Format the date using Intl.DateTimeFormat:
    // const date = new Intl.DateTimeFormat("en-US", {
    //     year: "numeric",
    //     month: "2-digit",
    //     day: "2-digit",
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     second: "2-digit",
    //     hour12: false,
    //     timeZone: "UTC",
    // }).format(dateObject);

    return (
        <li>
            {" "}
            <p>{blogArticle.title}</p>
            <p>{blogArticle.body}</p>
            <p>{blogArticle.source}</p>
            <p>{date}</p>
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
