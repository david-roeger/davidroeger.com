import React from 'react';

export const MusicSectionRow: React.FC<{
    className?: string;
    children: React.ReactNode;
}> = ({ className = '', children }) => {
    return (
        <li
            className={`border-t border-b-0 last:border-b border-mauve-12 ${className}`}>
            {children}
        </li>
    );
};
