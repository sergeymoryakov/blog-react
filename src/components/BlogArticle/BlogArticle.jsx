import React from "react";
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
        <li className="blog-article">
            <h3>{blogArticle.title}</h3>
            <p>{blogArticle.body}</p>
            <p className="blog-article_post-by">
                Posted by {blogArticle.source}
            </p>
            <p className="blog-article_date">{date}</p>
            {/* <div className="blog-article_source">
            </div> */}
        </li>
    );
}
export default BlogArticle;
