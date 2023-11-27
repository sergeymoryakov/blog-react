import React from "react";

function SpanError({ errorMessage, className }) {
    return <span className={className}>{errorMessage}</span>;
}

export default SpanError;
