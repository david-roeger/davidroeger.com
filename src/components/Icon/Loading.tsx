import React from 'react';

import { Svg } from './index';

const Loading: React.FC<{ color?: string; fill?: string }> = ({
    color = '',
    fill = 'text-white',
}) => {
    return (
        <div className="w-12 h-12 relative">
            <div className="absolute left-1 top-1 w-10 h-10 border border-black rounded-full " />
            <div className="animate-loading-fall absolute left-4 top-0 bg-green-500 border border-black w-4 h-4 rounded-full " />

            <div className="transform rotate-90 absolute left-0 top-0 w-12 h-12 rounded-full ">
                <div className="animate-loading-fall mx-auto bg-green-200 border border-black w-4 h-4 rounded-full " />
            </div>
        </div>
    );
};

export default Loading;
