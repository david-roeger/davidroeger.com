import React from 'react';

export const MusicSectionAtom: React.FC<{
    className?: string;
    children: React.ReactNode;
}> = ({ className = '', children }) => {
    if (className) return <div className={`${className}`}>{children}</div>;
    return <>{children}</>;
};
