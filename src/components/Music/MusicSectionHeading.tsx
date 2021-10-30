import React from 'react';

export const MusicSectionHeading: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <h2 className="text-base lg:text-xl inline">{children}</h2>;
};
