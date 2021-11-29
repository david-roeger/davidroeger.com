import React from 'react';

import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
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
import * as Icon from 'src/components/Icon';

import { topArtist, status, asyncState } from 'src/types';

export const TopArtistsSection: React.FC<{
    topArtistsState: asyncState;
    range: number;
}> = ({ topArtistsState, range }) => {
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
            return (
                <MusicSectionRoot>
                    <MusicSectionBody>
                        <MusicSectionError
                            length={8}
                            message={topArtistsState.error.message}
                        />
                    </MusicSectionBody>
                </MusicSectionRoot>
            );
        case status.resolved: {
            const topArtists = (topArtistsState.data[range] ||
                []) as topArtist[];
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
                                            <AccessibleIcon label="Tags">
                                                <Icon.Tag
                                                    fill="icon-mauve-5"
                                                    width={20}
                                                    height={20}
                                                />
                                            </AccessibleIcon>
                                            <AccessibleIcon label="Score">
                                                <Icon.Score
                                                    id={artist.id}
                                                    score={artist.popularity}
                                                    fill="icon-mauve-5"
                                                    width={20}
                                                    height={20}
                                                />
                                            </AccessibleIcon>
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
