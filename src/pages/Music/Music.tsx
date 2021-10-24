import React, { useEffect, useState, useContext } from 'react';

import { getSupabaseData } from './api/supabase';

import { BreakpointContext } from 'src/providers';

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

import { ExternalLink } from '../../components/ExternalLink';
import * as Tabs from 'src/components/StyledTabs';
import { Album, Tag, Artist, Score } from '../../components/Icon';

import { topTrack, topArtist, currentTrack, recentTrack } from '../../types';

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
                            <MusicSectionAtom className="flex-1 p-2 border-l border-mauve-12 min-w-0 md:pr-8 xl:pr-16 ">
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
};

const Music: React.FC = () => {
    const { breakpoint } = useContext(BreakpointContext);

    const [lastTrack, setLastTrack] = useState<currentTrack[] | recentTrack[]>(
        [],
    );
    const [topTracks, setTopTracks] = useState<topTrack[]>([]);
    const [topArtists, setTopArtists] = useState<topArtist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string[]>([]);

    const getData = async () => {
        const asyncErrors = [...errors];
        const { supabaseLastTrack, supabaseTopTracks, supaBaseTopArtists } =
            await getSupabaseData();

        const asyncLastTrack = lastTrack.length
            ? lastTrack
            : supabaseLastTrack[0];
        if (!lastTrack.length) {
            if (asyncLastTrack.length) {
                setLastTrack(asyncLastTrack);
            } else {
                asyncErrors.push('Something went wrong (CurrentSong) 🥺');
            }
        }

        const asyncTopTracks = topTracks.length
            ? topTracks
            : supabaseTopTracks[0];
        if (!topTracks.length) {
            if (asyncTopTracks?.length) {
                setTopTracks(asyncTopTracks);
            } else {
                asyncErrors.push('Something went wrong (TopTracks) 🥺');
            }
        }

        const asyncTopArtists = topArtists.length
            ? topArtists
            : supaBaseTopArtists[0];
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

    useEffect(() => {}, []);

    useEffect(() => {
        getData();
    }, []);

    const [selected, setSelected] = useState('tracks');
    return (
        <main className="my-16">
            <div className="m-8">
                <p>Loading: {loading ? 'true' : 'false'}</p>
                <p>Error:</p>
                {errors.length > 0 &&
                    errors.map((error, index) => <p key={index}>{error}</p>)}
            </div>
            <div className="grid grid-cols-[60px,1fr,fit-content(100%),1fr,60px] md:grid-cols-[84px,1fr,fit-content(100%),1fr,84px] my-16 items-center">
                <h1 className="col-start-3 font-cstmx text-6xl md:text-8xl lg:text-10xl">
                    MUSIC
                </h1>
                <div className="col-start-1 col-span-4 border-mauve-12 border-t" />
            </div>
            <div className="my-16">
                <div className="ml-[60px] md:ml-[84px] p-2 border-l border-t border-mauve-12 bg-mauve-3">
                    <MusicSectionHeading>Current Track</MusicSectionHeading>
                </div>
                <LastTrackSection lastTrack={lastTrack} />
            </div>
            <Tabs.Root
                defaultValue={selected}
                onValueChange={(value) => setSelected(value)}>
                <Tabs.List>
                    <Tabs.Trigger value="tracks" selected={selected}>
                        <MusicSectionHeading>Top Tracks</MusicSectionHeading>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="reversed"
                        value="artists"
                        selected={selected}>
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
        </main>
    );
};

export default Music;
