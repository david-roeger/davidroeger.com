import React, { useEffect, useState } from 'react';

import {
    getAccessToken,
    getTopTracks,
    getTopArtists,
    getLastTrack,
} from './api/spotify';

import { topTrack, topArtist, currentTrack, recentTrack } from './api/types';

/*
const sound = keyframes`
    0%,
    100% {
        transform: scale(1, .4);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
        transform: scale(1, 1);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
`;

const Audio = styled.span`
    span {
        transform-origin: bottom;
        animation: ${sound} 1.2s -200ms linear infinite;
        &:nth-child(2) {
            animation: ${sound} 2.3s -300ms linear infinite;
        }
        &:nth-child(3) {
            animation: ${sound} 1.8s -800ms linear infinite;
        }
        &:nth-child(4) {
            animation: ${sound} 1.4s linear infinite;
        }
        &:nth-child(5) {
            animation: ${sound} 2.9 -1.2s linear infinite;
        }
        &:nth-child(6) {
            animation: ${sound} 2s -100ms linear infinite;
        }
    }
`;
*/

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
        <article className="mt-8 mx-4">
            <p>Loading: {loading ? 'true' : 'false'}</p>

            <section className="mt-8">
                <h2>Current Track:</h2>
                {lastTrack.length > 0 &&
                    lastTrack.map((track: currentTrack | recentTrack) => (
                        <div
                            key={track.id}
                            className="flex border-t border-black border-b-0 last:border-b">
                            {track.album.images.length > 0 && (
                                <img
                                    className="h-10 "
                                    src={track.album.images[0].url}
                                    alt={`Album ${track.album.name} Cover`}
                                />
                            )}
                            <p className="flex-1 p-2 border-l border-black truncate">
                                {track.name} (
                                {track.artists
                                    .map((artist) => artist.name)
                                    .join(' | ')}
                                )
                            </p>
                            {track.hasOwnProperty('is_playable') && (
                                <span className="h-10 flex py-2 pt-3 pr-2 space-x-0.5">
                                    <span className="bg-green-500 w-0.5 h-full hidden lg:inline"></span>
                                    <span className="bg-green-400 w-0.5 h-full"></span>
                                    <span className="bg-green-500 w-0.5 h-full"></span>
                                    <span className="bg-green-400 w-0.5 h-full"></span>
                                    <span className="bg-green-500 w-0.5 h-full"></span>
                                    <span className="bg-green-400 w-0.5 h-full hidden lg:inline"></span>
                                </span>
                            )}
                        </div>
                    ))}
            </section>

            <section className="mt-8">
                <h2>Top Tracks:</h2>
                {topTracks.length > 0 &&
                    topTracks.map((track) => (
                        <div
                            key={track.id}
                            className="flex border border-black border-b-0 last:border-b">
                            {track.album.images.length > 0 && (
                                <img
                                    className="h-12 "
                                    src={track.album.images[0].url}
                                    alt={`Album ${track.album.name} Cover`}
                                />
                            )}
                            <p className="p-2 border-l border-black truncate">
                                {track.name} (
                                {track.artists
                                    .map((artist) => artist.name)
                                    .join(' | ')}
                                )
                            </p>
                        </div>
                    ))}
            </section>

            <section className="mt-8">
                <h2>Top Artists:</h2>
                {topArtists.length > 0 &&
                    topArtists.map((artist) => (
                        <div
                            key={artist.id}
                            className="flex border border-black border-b-0 last:border-b">
                            {artist.images.length > 0 && (
                                <img
                                    className="w-12 h-12 object-cover"
                                    src={artist.images[0].url}
                                    alt={`${artist.name} Image`}
                                />
                            )}
                            <p className="p-2 border-l border-black truncate">
                                {artist.name}
                            </p>
                        </div>
                    ))}
            </section>

            <section className="mt-8">
                <h2>Error:</h2>
                {errors.length > 0 &&
                    errors.map((error, index) => <p key={index}>{error}</p>)}
            </section>
        </article>
    );
};

export default Music;
