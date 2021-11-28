import React from 'react';

export const MusicSectionRoot: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return <section>{children}</section>;
};
