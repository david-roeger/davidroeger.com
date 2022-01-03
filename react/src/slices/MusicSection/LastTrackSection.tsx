import React from 'react';

import {
    MusicSectionRoot,
    MusicSectionBody,
    MusicSectionRow,
    MusicSectionAtom,
    MusicSectionImage,
    MusicSectionDetail,
    MusicSectionLoading,
    MusicSectionPlaying,
    MusicSectionError,
} from '../../components/Music';
import { ExternalLink } from 'src/components/ExternalLink';
import { Artist, Album } from 'src/components/Icon';

import { currentTrack, recentTrack, status, asyncState } from 'src/types';

export const LastTrackSection: React.FC<{
    lastTrackState: asyncState;
}> = ({ lastTrackState }) => {
    console.log(lastTrackState.status);
    switch (lastTrackState.status) {
        case status.idle:
        case status.pending:
            return (
                <MusicSectionRoot>
                    <MusicSectionBody>
                        <MusicSectionLoading length={1} />
                    </MusicSectionBody>
                </MusicSectionRoot>
            );
        case status.rejected:
            return (
                <MusicSectionRoot>
                    <MusicSectionBody>
                        <MusicSectionError
                            length={1}
                            message={lastTrackState.error.message}
                        />
                    </MusicSectionBody>
                </MusicSectionRoot>
            );
        case status.resolved: {
            const lastTrack = lastTrackState.data[0] as
                | currentTrack[]
                | recentTrack[];
            return (
                <MusicSectionRoot>
                    <MusicSectionBody>
                        {lastTrack.length > 0 &&
                            lastTrack.map((track) => (
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
                                    <MusicSectionAtom className="flex-1 p-2 border-l border-mauve-12 min-w-0 md:pr-8 xl:pr-16">
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
                                            {track.hasOwnProperty(
                                                'is_playable',
                                            ) && <MusicSectionPlaying />}
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
