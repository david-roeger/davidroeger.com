import React from 'react';

import { MusicSectionRow, MusicSectionAtom } from '.';

export const MusicSectionError: React.FC<{
    length?: number;
    message: string;
}> = ({ length = 1, message }) => {
    return (
        <>
            {[...Array(length)].map((undef, index) => (
                <MusicSectionRow className="flex" key={index}>
                    <MusicSectionAtom>
                        <div className="h-[60px] md:h-[84px] w-[60px] md:w-[84px] grid justify-items-center items-center"></div>
                    </MusicSectionAtom>
                    <MusicSectionAtom className="border-l border-mauve-12 p-2">
                        <div className="">
                            <p className="text-sm text-crimson-11 truncate">
                                Error:
                            </p>
                        </div>
                        <div className="flex items-center w-full">
                            <h3 className="md:text-xl truncate ">{message}</h3>
                        </div>
                        <div className="hidden md:block h-5"></div>
                    </MusicSectionAtom>
                </MusicSectionRow>
            ))}
        </>
    );
};
