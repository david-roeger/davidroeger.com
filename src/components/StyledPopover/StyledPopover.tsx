import React from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Close as CloseIcon } from '../Icon';

const Root: React.FC<Popover.PopoverProps> = ({ ...rest }) => (
    <Popover.Root {...rest} />
);

const Trigger: React.FC<
    Popover.PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>
> = ({ className = '', type = 'text', ...rest }) => {
    return (
        <Popover.Trigger
            className={`min-w-0 p-2 
        hover:bg-mauve-3
        focus-visible:ring-inset focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-mauve-12 
        cursor-pointer select-none 
        border-t border-r border-mauve-12 
        ${className}`}
            {...rest}
        />
    );
};

const Content: React.FC<
    Popover.PopoverContentProps & React.RefAttributes<HTMLDivElement>
> = ({ className = '', children, ...rest }) => (
    <Popover.Content
        className={`min-w-0 p-2 relative focus-visible:ring-inset focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-mauve-12 
cursor-pointer select-none 
border border-mauve-12 
${className}`}
        {...rest}>
        {children}
    </Popover.Content>
);

const Close: React.FC<
    Popover.PopoverCloseProps & React.RefAttributes<HTMLButtonElement>
> = ({ className = '', ...rest }) => (
    <Popover.PopoverClose
        aria-label="Close"
        className={`absolute top-0 right-0 min-w-0 m-2 focus-visible:ring-inset focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-mauve-12 border border-mauve-12 ${className}`}
        {...rest}>
        <CloseIcon />
    </Popover.PopoverClose>
);

export { Root, Trigger, Content, Close };
