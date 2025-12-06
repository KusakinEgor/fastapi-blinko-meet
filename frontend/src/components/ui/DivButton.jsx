import React, { Children } from "react";

const DivButton = ({ onClick, className = "", children }) => {
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " "){
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            className={`cursor-pointer select-none ${className}`}
        >
            {children}
        </div>
    )
};

export default DivButton;
