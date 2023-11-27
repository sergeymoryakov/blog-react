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
    const ids = [];
    const byId = {};

    blogArticles.map((item) => {
        ids.push(item.id);
        byId[item.id] = item;
    });

    // for tbs and debugging
    // console.log("blogArticles have been normalized:");
    // console.log("ids:", ids);
    // console.log("byId:", byId);

    return [ids, byId];
}
