import React from "react";
import { format } from "date-fns";

function BlogArticle({ blogArticle, onToggle, onDelete }) {
    const dateObject =
        blogArticle.date instanceof Date
            ? blogArticle.date
            : blogArticle.date.toDate();

    const date = format(dateObject, "yyyy-MM-dd HH:mm:ss");

    return (
        <li className="blog-article">
            <h3>{blogArticle.title}</h3>
            <p>{blogArticle.body}</p>
            <p className="blog-article_post-by">
                Posted by {blogArticle.source}
            </p>
            <p className="blog-article_date">{date}</p>
        </li>
    );
}
export default BlogArticle;
