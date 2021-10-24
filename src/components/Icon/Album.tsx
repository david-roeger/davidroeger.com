import React from 'react';

import { Svg } from './index';

import { iconProp } from 'src/types';

const Landing: React.FC<iconProp> = ({
    color = '',
    fill = 'text-white',
    width = 24,
    height = 24,
}) => {
    return (
        <Svg width={width} height={height}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                fill="currentColor"
                className={fill}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                fill="currentColor"
                className={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z"
                fill="currentColor"
                className={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 22V2H22V22H2ZM3 3H21V21H3V3Z"
                fill="currentColor"
                className={color}
            />
        </Svg>
    );
};

export default Landing;
