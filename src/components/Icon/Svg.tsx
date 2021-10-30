import React from 'react';

interface SvgProps {
    width?: number;
    height?: number;
    viewHeight?: number;
    viewWidth?: number;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
const Svg: React.FC<SvgProps> = ({
    width = 24,
    height = 24,
    viewHeight = 24,
    viewWidth = 24,
    className = '',
    style = {},
    children,
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            fill="none"
            style={style}
            xmlns="http://www.w3.org/2000/svg">
            {children}
        </svg>
    );
};

export default Svg;
