function ActionItem({ actionItem, onToggle, onDelete }) {
    return (
        <li>
            {" "}
            <p>{actionItem.title}</p>
            <input
                type="checkbox"
                checked={actionItem.completed}
                onChange={onToggle}
            />
            <button onClick={onDelete}>Delete</button>
        </li>
    );
}
export default ActionItem;
