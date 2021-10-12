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
    return <h2 className="md:text-xl">{children}</h2>;
};

export const MusicSectionBody: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <div className="w-full">{children}</div>;
};

export const MusicSectionRow: React.FC<{
    className?: string;
    children: React.ReactNode;
}> = ({ className = '', children }) => {
    return (
        <div
            className={`border border-b-0 last:border-b border-mauve-12 ${className}`}>
            {children}
        </div>
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
            width="68px"
            height="68px"
            className="h-[68px] w-[68px]  md:h-[92px] md:w-[92px] object-cover"
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
            <div className="flex w-full text-mauve-11">
                {children[0] && <div className="">{children[0]}</div>}
                <p className="truncate">{subline[0]}</p>
                <div className="md:hidden"></div>
            </div>
            <div className="flex items-center w-full">
                {children[2] && <div>{children[2]}</div>}{' '}
                <h3 className="md:text-xl truncate">{headline}</h3>
            </div>
            <div className="hidden md:flex w-full text-mauve-11">
                {children[1] && <div className="">{children[1]}</div>}
                <p className="truncate">{subline[1]}</p>
            </div>
        </>
    );
};

export const MusicSectionPlaying: React.FC = () => {
    return (
        <Wave
            fill={[
                'icon-green-500',
                'icon-green-500',
                'icon-green-500',
                'icon-green-500',
            ]}
        />
    );
};
