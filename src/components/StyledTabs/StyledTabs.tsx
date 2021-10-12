import React from 'react';

import * as Tabs from '@radix-ui/react-tabs';
const Root: React.FC<Tabs.TabsProps & React.RefAttributes<HTMLDivElement>> = ({
    className,
    ...rest
}) => <Tabs.Root className={`bg-green-500 ${className}`} {...rest} />;

const List: React.FC<Tabs.TabsListProps & React.RefAttributes<HTMLDivElement>> =
    ({ className, ...rest }) => (
        <Tabs.List className={`bg-green-500 ${className}`} {...rest} />
    );

const Trigger: React.FC<
    Tabs.TabsTriggerProps & React.RefAttributes<HTMLDivElement>
> = ({ className, ...rest }) => (
    <Tabs.Trigger className={`bg-green-500 ${className}`} {...rest} />
);

const Content: React.FC<
    Tabs.TabsContentProps & React.RefAttributes<HTMLDivElement>
> = ({ className, ...rest }) => (
    <Tabs.Content className={`bg-green-500 ${className}`} {...rest} />
);
export { Root, List, Trigger, Content };
