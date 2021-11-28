import React, { useState } from 'react';

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
import * as Popover from 'src/components/StyledPopover';
import * as RadioGroup from 'src/components/StyledRadioGroup';
import * as StyledSeperator from 'src/components/StyledSeperator';

import { Filter } from 'src/components/Icon';
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

    React.useEffect(() => {
        console.log(lastTrackState);
    }, [lastTrackState.status]);
    const topArtistsState = useAsync({
        status: status.pending,
    });

    React.useEffect(() => {
        const promise = getSupabaseTopArtists();
        topArtistsState.run(promise);
    }, [topArtistsState.run]);

    const [selected, setSelected] = useState('tracks');

    const ranges = ['short', 'medium', 'long'];
    const [range, setRange] = useState('short');

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
                    <Popover.Root>
                        <Popover.Trigger className="md:px-4">
                            <Filter
                                active={ranges.findIndex((r) => r === range)}
                                fill="icon-purple-5"
                            />
                        </Popover.Trigger>
                        <Popover.Content className="bg-white">
                            <h3 className="mr-16">Timespan</h3>
                            <StyledSeperator.Root />
                            <RadioGroup.Root
                                defaultValue={range}
                                onValueChange={(value) => setRange(value)}>
                                <RadioGroup.Item value="short">
                                    <RadioGroup.Indicator></RadioGroup.Indicator>
                                    <RadioGroup.Label>Short</RadioGroup.Label>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="medium">
                                    <RadioGroup.Indicator></RadioGroup.Indicator>
                                    <RadioGroup.Label>Medium</RadioGroup.Label>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="long">
                                    <RadioGroup.Indicator></RadioGroup.Indicator>
                                    <RadioGroup.Label>Long</RadioGroup.Label>
                                </RadioGroup.Item>
                            </RadioGroup.Root>
                            <Popover.Close />
                        </Popover.Content>
                    </Popover.Root>
                </Tabs.List>
                <Tabs.Content className="" value="tracks">
                    <TopTracksSection
                        topTracksState={topTracksState}
                        range={ranges.findIndex((r) => r === range)}
                    />
                </Tabs.Content>
                <Tabs.Content value="artists">
                    <TopArtistsSection
                        topArtistsState={topArtistsState}
                        range={ranges.findIndex((r) => r === range)}
                    />
                </Tabs.Content>
            </Tabs.Root>
            <p className="my-16 text-center">
                Made with by{' '}
                <a
                    href="https://spotify.com"
                    className="text-mauve-12 underline"
                    rel="noopener noreferrer"
                    target="_blank">
                    Spotify
                </a>
                {' 💚 '}
                <a
                    href="https://supabase.com/"
                    className="text-mauve-12 underline"
                    rel="noopener noreferrer"
                    target="_blank">
                    Supabase
                </a>{' '}
            </p>
        </main>
    );
};

export default Music;
