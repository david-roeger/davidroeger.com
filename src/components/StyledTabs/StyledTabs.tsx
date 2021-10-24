import React from 'react';

import * as Tabs from '@radix-ui/react-tabs';
const Root: React.FC<Tabs.TabsProps & React.RefAttributes<HTMLDivElement>> = ({
    className = '',
    ...rest
}) => <Tabs.Root className={`my-16 ${className}`} {...rest} />;

const List: React.FC<Tabs.TabsListProps & React.RefAttributes<HTMLDivElement>> =
    ({ className = '', ...rest }) => (
        <Tabs.List className={`flex ${className}`} {...rest} />
    );

interface StyledTabsTriggerProps extends Tabs.TabsTriggerProps {
    selected: string;
}
const Trigger: React.FC<
    StyledTabsTriggerProps & React.RefAttributes<HTMLDivElement>
> = ({ className = '', selected, value, ...rest }) => {
    return (
        <Tabs.Trigger
            className={`growing-underline-tabs flex-grow min-w-0 p-4 py-2 
        hover:bg-mauve-3
        focus:ring-inset focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-mauve-12 
        cursor-pointer select-none 
        border-t border-r first:border-l last:border-r-0 border-mauve-12 first:ml-[60px] md:first:ml-[84px] ${
            selected === value ? 'bg-purple-5 hover:bg-purple-5 selected' : ''
        } ${className}`}
            value={value}
            {...rest}
        />
    );
};

const Content: React.FC<
    Tabs.TabsContentProps & React.RefAttributes<HTMLDivElement>
> = ({ className = '', ...rest }) => (
    <Tabs.Content
        className={`focus-visible:ring-inset focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-mauve-12 ${className}`}
        {...rest}
    />
);
export { Root, List, Trigger, Content };
