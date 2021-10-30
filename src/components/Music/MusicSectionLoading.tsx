import React from 'react';

import { MusicSectionRow, MusicSectionAtom } from '.';
import { Loading } from '../Icon';

export const MusicSectionLoading: React.FC<{ length?: number }> = ({
    length = 1,
}) => {
    return (
        <>
            {[...Array(length)].map((undef, index) => (
                <MusicSectionRow className="flex" key={index}>
                    <MusicSectionAtom>
                        <div className="h-[60px] md:h-[84px] w-[60px] md:w-[84px] grid justify-items-center items-center">
                            <Loading fill="icon-purple-5" index={index} />
                        </div>
                    </MusicSectionAtom>
                    <MusicSectionAtom>
                        <div className="h-5"></div>
                        <div className="flex items-center w-full">
                            <h3 className="md:text-xl truncate mx-2">
                                Loading...
                            </h3>
                        </div>
                        <div className="hidden md:block h-5"></div>
                    </MusicSectionAtom>
                </MusicSectionRow>
            ))}
        </>
    );
};
