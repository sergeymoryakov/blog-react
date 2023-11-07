export function getNormActionItems(actionItemsList) {
    const ids = [];
    const byId = {};

    actionItemsList.map((item) => {
        ids.push(item.id);
        byId[item.id] = item;
    });

    return [ids, byId];
}
