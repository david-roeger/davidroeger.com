import React from 'react';

interface ButtonProps {
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
    return (
        <button className="px-4 py-2 bg-mauve-3 hover:bg-mauve-4 active:bg-mauve-5 rounded-md foucs:outline-none ">
            {children}
        </button>
    );
};

export default Button;
