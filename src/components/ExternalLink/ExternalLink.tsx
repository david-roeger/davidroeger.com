import React from 'react';

const ExternalLink: React.FC<{
    href: string;
    ghost?: boolean;
    children: React.ReactNode;
    className?: string;
}> = ({ ghost = false, href = '', children, className = '' }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener nofollow"
            tabIndex={ghost ? -1 : 0}
            className={`focus:outline-none ${
                ghost ? '' : 'growing-underline'
            } ${className}`}>
            {children}
        </a>
    );
};

export default ExternalLink;
