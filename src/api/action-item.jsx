const API_URL_BASE = "https://jsonplaceholder.typicode.com";
// const API_URL_ACTION_ITEMS = "https://jsonplaceholder.typicode.com/todos";

export function getActionItems() {
    return fetch(`${API_URL_BASE}/todos`).then((response) => {
        if (!response.ok) {
            throw new Error("API response failed");
        }
        return response.json();
    });
}
