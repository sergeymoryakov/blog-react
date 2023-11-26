import "./BlogArticleAdmin.css";
import { format } from "date-fns";
import deleteIcon from "../../assets/img_delete.png";

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
        <li className="blog-article">
            <h3>{blogArticle.title}</h3>
            <p>{blogArticle.body}</p>
            <p className="blog-article_post-by">
                Posted by {blogArticle.source}
            </p>
            <p className="blog-article_date">{date}</p>
            {/* <div className="blog-article_source">
            </div> */}
            <div className="blog-article_actions">
                <label className="blog-article_actions_label">
                    <input
                        className="blog-article_actions_checkbox"
                        type="checkbox"
                        name="hidden"
                        checked={blogArticle.completed}
                        onChange={onToggle}
                    />
                    - Hide article
                </label>
                {/* <button onClick={onToggle}>Hide article</button> */}
                <button className="delete-btn" onClick={onDelete}>
                    <img
                        className="delete-btn_img"
                        src={deleteIcon}
                        alt="Delete"
                    />
                </button>
            </div>
        </li>
    );
}
export default BlogArticle;
