import React from 'react';

import { Wave } from '../../components/Icon';
export const MusicSectionRoot: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return <section>{children}</section>;
};

export const MusicSectionHeading: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <h2 className="text-base lg:text-xl inline">{children}</h2>;
};

export const MusicSectionBody: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <ul className="w-full">{children}</ul>;
};

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

export const MusicSectionAtom: React.FC<{
    className?: string;
    children: React.ReactNode;
}> = ({ className = '', children }) => {
    if (className) return <div className={`${className}`}>{children}</div>;
    return <>{children}</>;
};

export const MusicSectionImage: React.FC<{
    url: string;
    alt: string;
}> = ({ url, alt }) => {
    return (
        <img
            width="60px"
            height="60px"
            className="h-[60px] md:h-[84px] w-[60px] md:w-[84px] object-cover"
            src={url}
            alt={alt}
        />
    );
};

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
            <div className="flex w-full text-sm text-mauve-11">
                {children[0] && <div className="">{children[0]}</div>}
                <p className="truncate">{subline[0]}</p>
                <div className="md:hidden"></div>
            </div>
            <div className="flex items-center w-full">
                <h3 className="md:text-xl truncate">{headline}</h3>
                {children[2] && <div>{children[2]}</div>}
            </div>
            <div className="hidden md:flex w-full text-sm text-mauve-11">
                {children[1] && <div className="">{children[1]}</div>}
                <p className="truncate">{subline[1]}</p>
            </div>
        </>
    );
};

export const MusicSectionPlaying: React.FC = () => {
    return (
        <>
            <Wave
                fill={[
                    'icon-green-9',
                    'icon-green-9',
                    'icon-green-9',
                    'icon-green-9',
                ]}
            />
        </>
    );
};
