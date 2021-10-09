import React, { useEffect, useState } from 'react';

import {
    getAccessToken,
    getTopTracks,
    getTopArtists,
    getLastTrack,
} from './api/spotify';

import { Album, Tag, Artist } from '../../components/Icon';
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
                                    <MusicSectionImage
                                        url={track.album.images[0].url}
                                        alt={`${track.album.name} Album Cover`}
                                    />
                                </MusicSectionAtom>
                            )}
                            <MusicSectionAtom classNames="flex-grow p-2 border-l-2 border-black min-w-0">
                                <MusicSectionDetail
                                    headline={track.name}
                                    subline={[
                                        track.artists
                                            .map((artist) => artist.name)
                                            .join(', '),
                                        track.album.name,
                                    ]}>
                                    <Artist fill="icon-gray-200" />
                                    <Album fill="icon-gray-200" />
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
                                    <MusicSectionImage
                                        url={track.album.images[0].url}
                                        alt={`${track.album.name} Album Cover`}
                                    />
                                </MusicSectionAtom>
                            )}
                            <MusicSectionAtom classNames="p-2 border-l-2 border-black min-w-0">
                                <MusicSectionDetail
                                    headline={track.name}
                                    subline={[
                                        track.artists
                                            .map((artist) => artist.name)
                                            .join(', '),
                                        track.album.name,
                                    ]}>
                                    <Artist fill="icon-gray-200" />
                                    <Album fill="icon-gray-200" />
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
                                    <MusicSectionImage
                                        url={
                                            artist.images[
                                                artist.images.length - 1
                                            ].url
                                        }
                                        alt={`${artist.name} Artist Image`}
                                    />
                                </MusicSectionAtom>
                            )}
                            <MusicSectionAtom classNames="p-2 border-l-2 border-black min-w-0">
                                <MusicSectionDetail
                                    headline={artist.name}
                                    subline={[artist.genres.join(', '), '']}>
                                    <Tag fill="icon-gray-200" />
                                    {''}
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

        setErrors([...asyncErrors]);
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);
    return (
        <main className="mt-8">
            <p>Loading: {loading ? 'true' : 'false'}</p>
            <p>Error:</p>
            {errors.length > 0 &&
                errors.map((error, index) => <p key={index}>{error}</p>)}
            <LastTrackSection lastTrack={lastTrack} />
            <TopTracksSection topTracks={topTracks} />
            <TopArtistsSection topArtists={topArtists} />
        </main>
    );
};

export default Music;
