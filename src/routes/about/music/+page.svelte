<script lang="ts">
	console.info('about/music: +page.svelte');

	import type { PageData } from './$types';
	export let data: PageData;

	import { Headline } from '$components/Headline';
	import { TopTracks, TopArtists, LastTrack } from '$slices/Music';

	import * as Tabs from '$primitives/Tabs';
	import { writable } from 'svelte/store';
	import Link from '$components/Link/Link.svelte';
	import * as Popper from '$primitives/Popper';
	import AccessibleIcon from '$components/AccessibleIcon';
	import * as RadioGroup from '$primitives/RadioGroup';
	import Filter from '$assets/Icons/24/filter.svg?component';
	import Close from '$assets/Icons/24/close.svg?component';

	const defaultSelected = 'tracks';
	const selected = writable(defaultSelected);

	let timeRange = 1;
	const timeRanges = [
		{
			label: 'last 4 Weeks',
			value: 'short'
		},
		{
			label: 'last 6 Months',
			value: 'medium'
		},
		{
			label: 'probably forever',
			value: 'long'
		}
	] as const;

	const topTracks = {
		short: data.topTracksShort,
		medium: data.topTracksMedium,
		long: data.topTracksLong
	};

	const topArtists = {
		short: data.topArtistsShort,
		medium: data.topArtistsMedium,
		long: data.topArtistsLong
	};
</script>

<Headline containerClass="flex items-end py-8 md:py-16">
	Favorite Music
</Headline>

<Headline
	as="h2"
	type="quaternary"
	id="current_track"
	containerClass="p-2 bg-white border-b border-mauve-6"
>
	Last listened on Spotify
</Headline>

<LastTrack
	labelledby="current_track"
	lastTrack={data.lastTrack}
	class="border-b bg-white/[.85] border-mauve-6 mb-8 md:mb-16"
/>

<Tabs.Root
	defaultValue={defaultSelected}
	on:valueChange={(e) => ($selected = e.detail.value)}
>
	<p class="p-2 bg-white border-t border-mauve-6">
		Favorite on Spotify <span class="text-mauve-11">
			({timeRanges[timeRange].label})
		</span>
	</p>

	<div class="flex p-2 space-x-2 border-t border-mauve-6">
		<Tabs.List
			ariaLabel="My Favorite Artists and Tracks on Spotify"
			class="w-full flex space-x-2"
		>
			<Tabs.Trigger
				value="tracks"
				class="flex-grow border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 px-4 py-2 rounded-l-full {$selected ===
				'tracks'
					? 'bg-purple-5'
					: 'bg-white'}"
			>
				<Headline as="h2" unstyled id="top_tracks" type="secondary">
					Tracks
				</Headline>
			</Tabs.Trigger>
			<Tabs.Trigger
				value="artists"
				class="flex-grow border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 px-4 py-2 rounded-r-full {$selected ===
				'artists'
					? 'bg-purple-5'
					: 'bg-white'}"
			>
				<Headline as="h2" unstyled type="secondary" id="top_artists">
					Artists
				</Headline>
			</Tabs.Trigger>
		</Tabs.List>
		<Popper.Root defaultOpen={false}>
			<Popper.Trigger
				class="p-2 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
			>
				<AccessibleIcon label="Filter Favorites">
					<Filter />
				</AccessibleIcon>
			</Popper.Trigger>
			<Popper.Content
				class="bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
				side="bottom"
				align="end"
				sideOffset={8}
				alignOffset={0}
				avoidCollision={false}
			>
				<Headline
					as="h2"
					id="timeHeadline"
					type="tertiary"
					class="border-b-0"
				>
					Time Range
				</Headline>

				<RadioGroup.Root
					defaultValue={timeRanges[timeRange].value}
					required
					name="time"
					labelledby="timeHeadline"
					orientation="vertical"
					class="p-2"
					on:valueChange={(e) =>
						(timeRange = timeRanges.findIndex(
							(range) => range.value === e.detail.value
						))}
				>
					{#each timeRanges as range}
						<div class="flex mb-2 space-x-2 last:mb-0 group">
							<RadioGroup.Item
								value={range.value}
								id={range.value}
								class="relative w-6 h-6 p-1 bg-white border rounded-full b border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 before:absolute before:inset-0 before:block before:m-1 before:rounded-full group-hover:before:bg-mauve-5 before:transition-colors"
							>
								<RadioGroup.Indicator
									class="block absolute inset-0 m-1 rounded-full bg-plum-5"
								/>
							</RadioGroup.Item>
							<label for={range.value} class="cursor-pointer ">
								{range.label}
							</label>
						</div>
					{/each}
				</RadioGroup.Root>

				<Popper.Close
					class="bg-white absolute top-0 right-0 p-2 -translate-y-[51px] translate-x-[1px] border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
				>
					<AccessibleIcon label="Close Popover">
						<Close />
					</AccessibleIcon>
				</Popper.Close>
			</Popper.Content>
		</Popper.Root>
	</div>
	<Tabs.Content
		value="tracks"
		class="border-t border-b bg-white/[.85] border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1"
	>
		<TopTracks
			labelledby="top_tracks"
			topTracks={topTracks[timeRanges[timeRange].value]}
		/>
	</Tabs.Content>
	<Tabs.Content
		value="artists"
		class="border-t border-b bg-white/[.85] border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1"
	>
		<TopArtists
			labelledby="top_artists"
			topArtists={topArtists[timeRanges[timeRange].value]}
		/>
	</Tabs.Content>
</Tabs.Root>

<div class="pt-8 mb-32 text-center md:pt-16">
	<p>Made with:</p>
	<p>
		<Link type="secondary" href="https://spotify.com">Spotify</Link>
		💚
		<Link type="secondary" href="https://supabase.com/">Supabase</Link>
	</p>
</div>
