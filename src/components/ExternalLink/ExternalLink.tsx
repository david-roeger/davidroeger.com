import React from 'react';

const ExternalLink: React.FC<{
    href: string;
    ghost?: boolean;
    children: React.ReactNode;
}> = ({ ghost = false, href = '', children }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener nofollow"
            tabIndex={ghost ? -1 : 0}
            className={`focus:outline-none ${
                ghost ? '' : 'transition-bg growing-underline'
            }`}>
            {children}
        </a>
    );
};

export default ExternalLink;
