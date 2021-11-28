import React from 'react';

import * as Separator from '@radix-ui/react-separator';

export default () => <Separator.Root />;

const Root: React.FC<
    Separator.SeparatorProps & React.RefAttributes<HTMLDivElement>
> = ({ className, ...rest }) => (
    <Separator.Root className="w-full h-px bg-mauve-12 my-2" {...rest} />
);

export { Root };
