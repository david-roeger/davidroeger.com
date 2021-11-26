import React from 'react';

import * as RadioGroup from '@radix-ui/react-radio-group';

const Root: React.FC<RadioGroup.RadioGroupProps> = ({ className, ...rest }) => (
    <RadioGroup.Root className="flex flex-col space-y-2" {...rest} />
);

const Item: React.FC<
    RadioGroup.RadioGroupItemProps & React.RefAttributes<HTMLButtonElement>
> = ({ className = '', type = 'text', children, id, value, ...rest }) => {
    const computedId = id ? id : `RadioGroupIdValue${value}`;

    let computedChildren: React.ReactNode;
    let computedLabel: React.ReactNode;
    if (Array.isArray(children)) {
        computedChildren = children.filter(
            (child) => child.type.name !== 'Label',
        );
        computedLabel = children.filter((child) => child.type.name === 'Label');
    }
    console.log(computedLabel);
    return (
        <div className="flex space-x-2">
            <RadioGroup.Item
                className={` w-6 h-6 rounded-full p-2 relative hover:bg-mauve-5 focus:ring-inset focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-mauve-12 border border-r border-mauve-12${className}`}
                id={computedId}
                value={value}
                {...rest}
                children={computedChildren}
            />
            {Array.isArray(computedLabel) && computedLabel[0] && (
                <Label htmlFor={computedId}>
                    {computedLabel[0].props.children}
                </Label>
            )}
        </div>
    );
};

const Indicator: React.FC<
    RadioGroup.RadioGroupIndicatorProps & React.RefAttributes<HTMLSpanElement>
> = ({ className = '', ...rest }) => (
    <RadioGroup.Indicator
        className={`rounded-full bg-purple-5 w-4 h-4 top-px left-px m-0.5 absolute ${className}`}
        {...rest}
    />
);

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({
    htmlFor,
    children,
}) => (
    <label htmlFor={htmlFor} className="text-sm">
        {children}
    </label>
);

export { Root, Item, Indicator, Label };
