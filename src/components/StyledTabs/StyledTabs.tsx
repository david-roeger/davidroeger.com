import React from 'react';

import * as Tabs from '@radix-ui/react-tabs';
const Root: React.FC<Tabs.TabsProps & React.RefAttributes<HTMLDivElement>> = ({
    className = '',
    ...rest
}) => <Tabs.Root className={`my-16 ${className}`} {...rest} />;

const List: React.FC<Tabs.TabsListProps & React.RefAttributes<HTMLDivElement>> =
    ({ className = '', ...rest }) => (
        <Tabs.List className={`flex space-x-0.5 ${className}`} {...rest} />
    );

interface StyledTabsTriggerProps extends Tabs.TabsTriggerProps {
    selected: string;
}
const Trigger: React.FC<
    StyledTabsTriggerProps & React.RefAttributes<HTMLDivElement>
> = ({ className = '', selected, value, ...rest }) => (
    <Tabs.Trigger
        className={`flex-grow min-w-0 p-4 py-2 hover:bg-mauve-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus:ring-mauve-12 cursor-pointer select-none border border-mauve-12 first:rounded-l-full last:rounded-r-full ${
            selected === value ? 'bg-purple-6 hover:bg-purple-6' : ''
        } ${className}`}
        value={value}
        {...rest}
    />
);

const Content: React.FC<
    Tabs.TabsContentProps & React.RefAttributes<HTMLDivElement>
> = ({ className = '', ...rest }) => (
    <Tabs.Content
        className={`mt-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-mauve-12 ${className}`}
        {...rest}
    />
);
export { Root, List, Trigger, Content };
