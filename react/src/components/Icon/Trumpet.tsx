import React from 'react';

import { Svg } from './index';

const Trumpet: React.FC<{ color?: string; fill?: string }> = ({
    color = 'text-black',
    fill = 'text-white',
}) => {
    return (
        <Svg>
            <path
                d="M2 11C2 10.4477 2.44772 10 3 10H15V13H3C2.44772 13 2 12.5523 2 12V11Z"
                fill="currentColor"
                className={fill}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 13C16.5463 13 18.7751 14.3596 20 16.3924C20.1184 16.5889 20.2274 16.7916 20.3264 17H21V6H20.3264C20.2274 6.2084 20.1184 6.41114 20 6.60759C18.7751 8.64042 16.5463 10 14 10H3C2.44772 10 2 10.4477 2 11V12C2 12.5523 2.44772 13 3 13H4.26756C4.09739 13.2942 4 13.6357 4 14C4 15.1046 4.89543 16 6 16H12C13.1046 16 14 15.1046 14 14C14 13.6357 13.9026 13.2942 13.7324 13H14ZM20 8.29139C18.7424 9.71637 16.9844 10.6906 15 10.9381V12.0619C16.9844 12.3094 18.7424 13.2836 20 14.7086V8.29139ZM14 12V11H3V12H14ZM12 13H6C5.44772 13 5 13.4477 5 14C5 14.5523 5.44772 15 6 15H12C12.5523 15 13 14.5523 13 14C13 13.4477 12.5523 13 12 13Z"
                fill="currentColor"
                className={color}
            />
        </Svg>
    );
};

export default Trumpet;
