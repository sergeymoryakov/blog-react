export function getNormActionItems(actionItemsList) {
    const ids = [];
    const byId = {};

    actionItemsList.map((item) => {
        ids.push(item.id);
        byId[item.id] = item;
    });

    return [ids, byId];
}

export function getNormBlogArticles(blogArticles) {
    // Display to console a message that the function has been called
    console.log("getNormBlogArticles() has been called.");

    const ids = [];
    const byId = {};

    blogArticles.map((item) => {
        ids.push(item.id);
        byId[item.id] = item;
    });

    return [ids, byId];
}
