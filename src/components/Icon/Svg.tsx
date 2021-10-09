import React from 'react';

interface SvgProps {
    width?: number;
    height?: number;
    viewHeight?: number;
    viewWidth?: number;
    classNames?: string;
    children: React.ReactNode;
}
const Svg: React.FC<SvgProps> = ({
    width = 24,
    height = 24,
    viewHeight = 24,
    viewWidth = 24,
    classNames = '',
    children,
}) => {
    return (
        <svg
            className={classNames}
            width={width}
            height={height}
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            {children}
        </svg>
    );
};

export default Svg;
