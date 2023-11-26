import React from "react";
import "./InputField.css";

function InputField({
    type,
    placeholder,
    value,
    onChange,
    // maxLength,
    // required,
    className,
}) {
    if (type === "textarea") {
        return (
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                // maxLength={maxLength}
                // required={required}
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
            // maxLength={maxLength}
            // required={required}
            className={className}
        />
    );
}

export default InputField;
