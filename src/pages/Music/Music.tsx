import React, { useEffect, useState } from 'react';

import {
    getAccessToken,
    getTopTracks,
    getTopArtists,
    getLastTrack,
} from './api/spotify';

import { ExternalLink } from '../../components/ExternalLink';

import { Button } from 'src/components';
import { Album, Tag, Artist, Score } from '../../components/Icon';
import { topTrack, topArtist, currentTrack, recentTrack } from './api/types';
import {
    MusicSectionBody,
    MusicSectionHeading,
    MusicSectionRoot,
    MusicSectionRow,
    MusicSectionAtom,
    MusicSectionImage,
    MusicSectionDetail,
    MusicSectionPlaying,
} from 'src/slices/MusicSection';

const LastTrackSection: React.FC<{
    lastTrack: currentTrack[] | recentTrack[];
}> = ({ lastTrack }) => {
    return (
        <MusicSectionRoot>
            <MusicSectionHeading>Current Track</MusicSectionHeading>
            <MusicSectionBody>
                {lastTrack.length > 0 &&
                    lastTrack.map((track: currentTrack | recentTrack) => (
                        <MusicSectionRow classNames="flex" key={track.id}>
                            {track.album.images.length > 0 && (
                                <MusicSectionAtom>
                                    <ExternalLink
                                        href={track.external_urls.spotify}
                                        ghost>
                                        <MusicSectionImage
                                            url={track.album.images[0].url}
                                            alt={`${track.album.name} Album Cover`}
                                        />
                                    </ExternalLink>
                                </MusicSectionAtom>
                            )}
                            <MusicSectionAtom classNames="flex-1 p-2 border-l border-mauve-12 min-w-0">
                                <MusicSectionDetail
                                    headline={
                                        <ExternalLink
                                            href={track.external_urls.spotify}>
                                            {track.name}
                                        </ExternalLink>
                                    }
                                    subline={[
                                        track.artists
                                            .map((artist) => artist.name)
                                            .join(', '),
                                        track.album.name,
                                    ]}>
                                    <Artist fill="icon-mauve-5" />
                                    <Album fill="icon-mauve-5" />
                                    {track.hasOwnProperty('is_playable') && (
                                        <MusicSectionPlaying />
                                    )}
                                </MusicSectionDetail>
                            </MusicSectionAtom>
                        </MusicSectionRow>
                    ))}
            </MusicSectionBody>
        </MusicSectionRoot>
    );
};

const TopTracksSection: React.FC<{ topTracks: topTrack[] }> = ({
    topTracks,
}) => {
    return (
        <MusicSectionRoot>
            <MusicSectionHeading>Top Tracks</MusicSectionHeading>
            <MusicSectionBody>
                {topTracks.length > 0 &&
                    topTracks.map((track) => (
                        <MusicSectionRow classNames="flex" key={track.id}>
                            {track.album.images.length > 0 && (
                                <MusicSectionAtom>
                                    <ExternalLink
                                        href={track.external_urls.spotify}
                                        ghost>
                                        <MusicSectionImage
                                            url={track.album.images[0].url}
                                            alt={`${track.album.name} Album Cover`}
                                        />
                                    </ExternalLink>
                                </MusicSectionAtom>
                            )}
                            <MusicSectionAtom classNames="flex-1 p-2 border-l border-mauve-12 min-w-0">
                                <MusicSectionDetail
                                    headline={
                                        <ExternalLink
                                            href={track.external_urls.spotify}>
                                            {track.name}
                                        </ExternalLink>
                                    }
                                    subline={[
                                        track.artists
                                            .map((artist) => artist.name)
                                            .join(', '),
                                        track.album.name,
                                    ]}>
                                    <Artist fill="icon-mauve-5" />
                                    <Album fill="icon-mauve-5" />
                                </MusicSectionDetail>
                            </MusicSectionAtom>
                        </MusicSectionRow>
                    ))}
            </MusicSectionBody>
        </MusicSectionRoot>
    );
};

const TopArtistsSection: React.FC<{ topArtists: topArtist[] }> = ({
    topArtists,
}) => {
    return (
        <MusicSectionRoot>
            <MusicSectionHeading>Top Artists</MusicSectionHeading>
            <MusicSectionBody>
                {topArtists.length > 0 &&
                    topArtists.map((artist) => (
                        <MusicSectionRow classNames="flex" key={artist.id}>
                            {artist.images.length > 0 && (
                                <MusicSectionAtom>
                                    <ExternalLink
                                        href={artist.external_urls.spotify}
                                        ghost>
                                        <MusicSectionImage
                                            url={
                                                artist.images[
                                                    artist.images.length - 1
                                                ].url
                                            }
                                            alt={`${artist.name} Artist Image`}
                                        />
                                    </ExternalLink>
                                </MusicSectionAtom>
                            )}
                            <MusicSectionAtom classNames="flex-1 p-2 border-l border-mauve-12 min-w-0">
                                <MusicSectionDetail
                                    headline={
                                        <ExternalLink
                                            href={artist.external_urls.spotify}>
                                            {artist.name}
                                        </ExternalLink>
                                    }
                                    subline={[
                                        artist.genres.join(', '),
                                        `${artist.popularity} / 100`,
                                    ]}>
                                    <Tag fill="icon-mauve-5" />
                                    <Score
                                        id={artist.id}
                                        fill="icon-mauve-5"
                                        score={artist.popularity}
                                    />
                                </MusicSectionDetail>
                            </MusicSectionAtom>
                        </MusicSectionRow>
                    ))}
            </MusicSectionBody>
        </MusicSectionRoot>
    );
};

const Music: React.FC = () => {
    const [accessToken, setAccessToken] = useState<string>('');
    const [lastTrack, setLastTrack] = useState<currentTrack[] | recentTrack[]>(
        [],
    );
    const [topTracks, setTopTracks] = useState<topTrack[]>([]);
    const [topArtists, setTopArtists] = useState<topArtist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string[]>([]);
    const getData = async () => {
        const asyncErrors = [...errors];
        const asyncAccessToken = accessToken || (await getAccessToken());
        if (!accessToken) {
            if (asyncAccessToken) {
                setAccessToken(asyncAccessToken);
            } else {
                asyncErrors.push('Something went wrong (Accesstoken) 🥺');
            }
        }

        const asyncLastTrack = lastTrack.length
            ? lastTrack
            : await getLastTrack(asyncAccessToken);
        if (!lastTrack.length) {
            if (asyncLastTrack.length) {
                setLastTrack(asyncLastTrack);
            } else {
                asyncErrors.push('Something went wrong (CurrentSong) 🥺');
            }
        }

        const asyncTopTracks = topTracks.length
            ? topTracks
            : await getTopTracks(asyncAccessToken);
        if (!topTracks.length) {
            if (asyncTopTracks.length) {
                setTopTracks(asyncTopTracks);
            } else {
                asyncErrors.push('Something went wrong (TopTracks) 🥺');
            }
        }

        const asyncTopArtists = topArtists.length
            ? topArtists
            : await getTopArtists(asyncAccessToken);
        if (!topArtists.length) {
            if (asyncTopArtists.length) {
                setTopArtists(asyncTopArtists);
            } else {
                asyncErrors.push('Something went wrong (TopArtists) 🥺');
            }
        }

        console.log(asyncTopArtists);
        setErrors([...asyncErrors]);
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);
    return (
        <main className="xl:container xl:mx-auto">
            <Button>Button</Button>
            <h1>MUSIC</h1>
            <div className="m-8">
                <LastTrackSection lastTrack={lastTrack} />

                <TopTracksSection topTracks={topTracks} />
                <TopArtistsSection topArtists={topArtists} />

                <p>Loading: {loading ? 'true' : 'false'}</p>
                <p>Error:</p>
                {errors.length > 0 &&
                    errors.map((error, index) => <p key={index}>{error}</p>)}
            </div>
        </main>
    );
};

export default Music;
