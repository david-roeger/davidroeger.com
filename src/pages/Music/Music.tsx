import React, { useEffect, useState } from 'react';

import {
    getSupabaseLastTrack,
    getSupabaseTopTracks,
    getSupabaseTopArtists,
} from './api/supabase';

import { useAsync } from '../../hooks';

import {
    LastTrackSection,
    TopTracksSection,
    TopArtistsSection,
} from 'src/slices/MusicSection';
import { MusicSectionHeading } from 'src/components/Music';

import * as Tabs from 'src/components/StyledTabs';

import { status } from '../../types';

const Music: React.FC = () => {
    const lastTrackState = useAsync({
        status: status.pending,
    });
    React.useEffect(() => {
        const promise = getSupabaseLastTrack();
        lastTrackState.run(promise);
    }, [lastTrackState.run]);

    const topTracksState = useAsync({
        status: status.pending,
    });
    React.useEffect(() => {
        const promise = getSupabaseTopTracks();
        topTracksState.run(promise);
    }, [topTracksState.run]);

    const topArtistsState = useAsync({
        status: status.pending,
    });
    React.useEffect(() => {
        const promise = getSupabaseTopArtists();
        topArtistsState.run(promise);
    }, [topArtistsState.run]);

    const [selected, setSelected] = useState('tracks');
    return (
        <main className="my-16">
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
                <LastTrackSection lastTrackState={lastTrackState} />
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
                    <TopTracksSection topTracksState={topTracksState} />
                </Tabs.Content>
                <Tabs.Content value="artists">
                    <TopArtistsSection topArtistsState={topArtistsState} />
                </Tabs.Content>
            </Tabs.Root>
        </main>
    );
};

export default Music;
