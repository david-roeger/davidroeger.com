import React, { useEffect, useState } from 'react';

import {
    getAccessToken,
    getTopTracks,
    getTopArtists,
    getLastTrack,
} from './api/spotify';

import { ExternalLink } from '../../components/ExternalLink';

import { Button } from 'src/components';
import * as Tabs from 'src/components/StyledTabs';
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
            <MusicSectionBody>
                {lastTrack.length > 0 &&
                    lastTrack.map((track: currentTrack | recentTrack) => (
                        <MusicSectionRow className="flex" key={track.id}>
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
                            <MusicSectionAtom className="flex-1 p-2 border-l border-mauve-12 min-w-0">
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
            <MusicSectionBody>
                {topTracks.length > 0 &&
                    topTracks.map((track) => (
                        <MusicSectionRow className="flex" key={track.id}>
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
                            <MusicSectionAtom className="flex-1 p-2 border-l border-mauve-12 min-w-0">
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
            <MusicSectionBody>
                {topArtists.length > 0 &&
                    topArtists.map((artist) => (
                        <MusicSectionRow className="flex" key={artist.id}>
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
                            <MusicSectionAtom className="flex-1 p-2 border-l border-mauve-12 min-w-0">
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

    const [selected, setSelected] = useState('tracks');
    return (
        <main className="mx-2 my-16  md:mx-4 xl:container xl:mx-auto">
            <div className="grid grid-cols-[1fr,fit-content(100%), 1fr] my-16 items-center space-x-2">
                <h1 className="col-start-2 font-cstmx text-6xl md:text-8xl lg:text-10xl">
                    MUSIC
                </h1>
                <div className="col-start-2 border-mauve-12 border-t" />
            </div>
            <div className="my-16">
                <div className="mt-4 px-4 py-2 border border-b-0 border-mauve-12 bg-mauve-3">
                    <MusicSectionHeading>Current Track</MusicSectionHeading>
                </div>
                <LastTrackSection lastTrack={lastTrack} />
            </div>
            <Tabs.Root
                defaultValue="tracks"
                onValueChange={(value) => setSelected(value)}>
                <Tabs.List>
                    <Tabs.Trigger value="tracks" selected={selected}>
                        <MusicSectionHeading>Top Tracks</MusicSectionHeading>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="artists" selected={selected}>
                        <MusicSectionHeading>Top Artists</MusicSectionHeading>
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content className="" value="tracks">
                    <TopTracksSection topTracks={topTracks} />
                </Tabs.Content>
                <Tabs.Content value="artists">
                    <TopArtistsSection topArtists={topArtists} />
                </Tabs.Content>
            </Tabs.Root>
            <div className="my-16 grid grid-cols-2 space-x-2">
                <div>
                    <div className="mt-4 px-4 py-2 border border-b-0 border-mauve-12 bg-mauve-3">
                        <MusicSectionHeading>Top Tracks</MusicSectionHeading>
                    </div>
                    <TopTracksSection topTracks={topTracks} />
                </div>
                <div>
                    <div className="mt-4 px-4 py-2 border border-b-0 border-mauve-12 bg-mauve-3">
                        <MusicSectionHeading>Top Artists</MusicSectionHeading>
                    </div>
                    <TopArtistsSection topArtists={topArtists} />
                </div>
            </div>
            <div className="m-8">
                <p>Loading: {loading ? 'true' : 'false'}</p>
                <p>Error:</p>
                {errors.length > 0 &&
                    errors.map((error, index) => <p key={index}>{error}</p>)}
            </div>
        </main>
    );
};

export default Music;
