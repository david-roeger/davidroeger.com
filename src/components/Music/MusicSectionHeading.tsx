import React from 'react';

export const MusicSectionHeading: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <h2 className="text-base inline">{children}</h2>;
};
