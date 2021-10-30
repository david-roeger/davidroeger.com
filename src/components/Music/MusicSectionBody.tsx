import React from 'react';

export const MusicSectionBody: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return <ul className="w-full">{children}</ul>;
};
