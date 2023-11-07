function ActionItem({ actionItem, onDeleteBtnClick }) {
    return (
        <li>
            {" "}
            <p>{actionItem.title}</p>
            <button onClick={onDeleteBtnClick}>Delete</button>
        </li>
    );
}
export default ActionItem;
