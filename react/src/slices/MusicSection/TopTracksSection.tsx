import React from 'react';

import {
    MusicSectionRoot,
    MusicSectionBody,
    MusicSectionRow,
    MusicSectionAtom,
    MusicSectionImage,
    MusicSectionDetail,
    MusicSectionLoading,
    MusicSectionError,
} from '../../components/Music';
import { ExternalLink } from 'src/components/ExternalLink';
import { Artist, Album } from 'src/components/Icon';

import { topTrack, status, asyncState } from 'src/types';

export const TopTracksSection: React.FC<{
    topTracksState: asyncState;
    range: number;
}> = ({ topTracksState, range }) => {
    switch (topTracksState.status) {
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
            return (
                <MusicSectionRoot>
                    <MusicSectionBody>
                        <MusicSectionError
                            length={8}
                            message={topTracksState.error.message}
                        />
                    </MusicSectionBody>
                </MusicSectionRoot>
            );
        case status.resolved: {
            const topTracks = (topTracksState.data[range] || []) as topTrack[];
            return (
                <MusicSectionRoot>
                    <MusicSectionBody>
                        {topTracks.length > 0 &&
                            topTracks.map((track) => (
                                <MusicSectionRow
                                    className="flex"
                                    key={track.id}
                                >
                                    {track.album.images.length > 0 && (
                                        <MusicSectionAtom>
                                            <ExternalLink
                                                href={
                                                    track.external_urls.spotify
                                                }
                                                ghost
                                            >
                                                <MusicSectionImage
                                                    url={
                                                        track.album.images[0]
                                                            .url
                                                    }
                                                    alt={`${track.album.name} Album Cover`}
                                                />
                                            </ExternalLink>
                                        </MusicSectionAtom>
                                    )}
                                    <MusicSectionAtom className="flex-1 p-2 border-l border-mauve-12 min-w-0">
                                        <MusicSectionDetail
                                            headline={
                                                <ExternalLink
                                                    href={
                                                        track.external_urls
                                                            .spotify
                                                    }
                                                >
                                                    {track.name}
                                                </ExternalLink>
                                            }
                                            subline={[
                                                track.artists
                                                    .map(
                                                        (artist) => artist.name,
                                                    )
                                                    .join(', '),
                                                track.album.name,
                                            ]}
                                        >
                                            <Artist
                                                fill="icon-mauve-5"
                                                width={20}
                                                height={20}
                                            />
                                            <Album
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
