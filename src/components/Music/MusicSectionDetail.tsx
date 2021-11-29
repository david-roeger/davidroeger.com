import React from 'react';

export const MusicSectionDetail: React.FC<{
    headline: string | React.ReactElement;
    subline: [string, string];
    children: [
        React.ReactChild | undefined,
        React.ReactChild | undefined,
        React.ReactNode?,
    ];
}> = ({ headline, subline, children }) => {
    return (
        <>
            <div className="flex space-x-1 w-full text-sm text-mauve-11">
                {children[0] && <div className="">{children[0]}</div>}
                <p className="truncate">{subline[0]}</p>
                <div className="md:hidden"></div>
            </div>
            <div className="flex items-center w-full">
                <h3 className="md:text-xl truncate">{headline}</h3>
                {children[2] && <div>{children[2]}</div>}
            </div>
            <div className="hidden md:flex space-x-1 w-full text-sm text-mauve-11">
                {children[1] && <div className="">{children[1]}</div>}
                <p className="truncate">{subline[1]}</p>
            </div>
        </>
    );
};
