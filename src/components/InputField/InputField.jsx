import React from "react";
import "./InputField.css";

function InputField({ type, placeholder, value, onChange, className }) {
    if (type === "textarea") {
        return (
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={className}
            />
        );
    }

    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
        />
    );
}

export default InputField;
