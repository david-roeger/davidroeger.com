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
    return <h2 className="text-2xl">{children}</h2>;
};

export const MusicSectionBody: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <div className="w-full border border-black">{children}</div>;
};

export const MusicSectionRow: React.FC<{
    href?: string;
    classNames?: string;
    children: React.ReactNode;
}> = ({ href, classNames = '', children }) => {
    if (href) {
        return (
            <a
                href={href}
                className={`border border-black ${classNames}`}
                target="_blank">
                {children}
            </a>
        );
    }
    return (
        <div className={`border border-black ${classNames}`}>{children}</div>
    );
};

export const MusicSectionAtom: React.FC<{
    classNames?: string;
    children: React.ReactNode;
}> = ({ classNames = '', children }) => {
    if (classNames) return <div className={`${classNames}`}>{children}</div>;
    return <>{children}</>;
};

export const MusicSectionImage: React.FC<{
    url: string;
    alt: string;
}> = ({ url, alt }) => {
    return (
        <img
            className="h-[68px] w-[68px]  md:h-[92px] md:w-[92px] object-cover"
            src={url}
            alt={alt}
        />
    );
};

export const MusicSectionDetail: React.FC<{
    headline: string;
    subline: [string, string];
    children: [
        React.ReactChild | undefined,
        React.ReactChild | undefined,
        React.ReactNode?,
    ];
}> = ({ headline, subline, children }) => {
    return (
        <>
            <div className="flex w-full text-gray-500">
                {children[0] && <div className="">{children[0]}</div>}
                <p className="truncate">{subline[0]}</p>
                <div className="md:hidden"></div>
            </div>
            <div className="flex items-center w-full">
                {children[2] && <div>{children[2]}</div>}{' '}
                <h3 className="text-xl truncate">{headline}</h3>
            </div>
            <div className="hidden md:flex w-full text-gray-500">
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