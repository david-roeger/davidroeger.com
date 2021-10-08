import React, { useEffect, useState } from 'react';

import {
    getAccessToken,
    getTopTracks,
    getTopArtists,
    getLastTrack,
} from './api/spotify';

import { topTrack, topArtist, currentTrack, recentTrack } from './api/types';

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
        <article className="mt-8">
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
                                    <span className="origin-bottom animate-sound-1 bg-green-500 w-0.5 h-full hidden lg:inline"></span>
                                    <span className="origin-bottom animate-sound-2 bg-green-400 w-0.5 h-full"></span>
                                    <span className="origin-bottom animate-sound-3 bg-green-500 w-0.5 h-full"></span>
                                    <span className="origin-bottom animate-sound-4 bg-green-400 w-0.5 h-full"></span>
                                    <span className="origin-bottom animate-sound-5 bg-green-500 w-0.5 h-full"></span>
                                    <span className="origin-bottom animate-sound-6 bg-green-400 w-0.5 h-full hidden lg:inline"></span>
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
                            className="flex border-t border-black border-b-0 last:border-b">
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
                            className="flex border-t border-black border-b-0 last:border-b">
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
