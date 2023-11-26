import React from "react";
import "./FormModal.css";

function FormModal({ isVisible, onClose, children }) {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="form-modal" onClick={onClose}>
            <div onClick={(event) => event.stopPropagation()}>
                {children}
                <button type="button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default FormModal;
