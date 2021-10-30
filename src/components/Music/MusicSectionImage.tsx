import React from 'react';

export const MusicSectionImage: React.FC<{
    url: string;
    alt: string;
}> = ({ url, alt }) => {
    return (
        <img
            width="60px"
            height="60px"
            className="h-[60px] md:h-[84px] w-[60px] md:w-[84px] object-cover bg-mauve-3"
            src={url}
            alt={alt}
        />
    );
};
