import React from 'react';

import {
    MusicSectionRoot,
    MusicSectionBody,
    MusicSectionRow,
    MusicSectionAtom,
    MusicSectionImage,
    MusicSectionDetail,
    MusicSectionLoading,
} from '../../components/Music';
import { ExternalLink } from 'src/components/ExternalLink';
import { Tag, Score } from 'src/components/Icon';

import { topArtist, status, asyncState } from 'src/types';

export const TopArtistsSection: React.FC<{
    topArtistsState: asyncState;
}> = ({ topArtistsState }) => {
    switch (topArtistsState.status) {
        case status.idle:
        case status.pending:
            return (
                <MusicSectionRoot>
                    <MusicSectionBody>
                        <MusicSectionLoading length={8} />
                    </MusicSectionBody>
                </MusicSectionRoot>
            );
        case status.rejected:
            return <div>Error</div>;
        case status.resolved: {
            const topArtists = topArtistsState.data[0] as topArtist[];
            return (
                <MusicSectionRoot>
                    <MusicSectionBody>
                        {topArtists.length > 0 &&
                            topArtists.map((artist) => (
                                <MusicSectionRow
                                    className="flex"
                                    key={artist.id}>
                                    {artist.images.length > 0 && (
                                        <MusicSectionAtom>
                                            <ExternalLink
                                                href={
                                                    artist.external_urls.spotify
                                                }
                                                ghost>
                                                <MusicSectionImage
                                                    url={
                                                        artist.images[
                                                            artist.images
                                                                .length - 1
                                                        ].url
                                                    }
                                                    alt={`${artist.name} Artist Image`}
                                                />
                                            </ExternalLink>
                                        </MusicSectionAtom>
                                    )}
                                    <MusicSectionAtom className="flex-1 p-2 border-l border-mauve-12 min-w-0">
                                        <MusicSectionDetail
                                            headline={
                                                <ExternalLink
                                                    href={
                                                        artist.external_urls
                                                            .spotify
                                                    }>
                                                    {artist.name}
                                                </ExternalLink>
                                            }
                                            subline={[
                                                artist.genres.join(', '),
                                                `${artist.popularity} / 100`,
                                            ]}>
                                            <Tag
                                                fill="icon-mauve-5"
                                                width={20}
                                                height={20}
                                            />
                                            <Score
                                                id={artist.id}
                                                score={artist.popularity}
                                                fill="icon-mauve-5"
                                                width={20}
                                                height={20}
                                            />
                                        </MusicSectionDetail>
                                    </MusicSectionAtom>
                                </MusicSectionRow>
                            ))}
                    </MusicSectionBody>
                </MusicSectionRoot>
            );
        }
        default:
            throw new Error('This should be impossible');
    }
};
