import React from 'react';

import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import * as Icon from '../Icon';

export const MusicSectionPlaying: React.FC = () => {
    return (
        <>
            <AccessibleIcon label="(Currently Playing)">
                <Icon.Wave
                    fill={[
                        'icon-green-9',
                        'icon-green-9',
                        'icon-green-9',
                        'icon-green-9',
                    ]}
                />
            </AccessibleIcon>
        </>
    );
};
