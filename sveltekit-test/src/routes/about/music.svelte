<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type {
		SpotifyLastTrackResponse,
		SpotifyTopArtistsResponse,
		SpotifyTopTracksResponse,
	} from '$components/Music/types';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res: Response = await fetch('/about/music.json');
		if (res.ok) {
			const body = await res.json();
			const {
				lastTrackResponse,
				topTracksShortResponse,
				topTracksMediumResponse,
				topTrackLongResponse,
				topArtistsShortResponse,
				topArtistsMediumResponse,
				topArtistsLongResponse,
			} = body;

			return {
				props: {
					lastTrackResponse:
						lastTrackResponse as SpotifyLastTrackResponse,
					topTracksResponses: [
						topTracksShortResponse,
						topTracksMediumResponse,
						topTrackLongResponse,
					] as SpotifyTopTracksResponse[],
					topArtistsResponses: [
						topArtistsShortResponse,
						topArtistsMediumResponse,
						topArtistsLongResponse,
					] as SpotifyTopArtistsResponse[],
				},
			};
		}

		throw new Error("Couldn't load music data");
		
	};
</script>

<script lang="ts">
	export let topTracksResponses: SpotifyTopTracksResponse[];
	export let topArtistsResponses: SpotifyTopArtistsResponse[];
	export let lastTrackResponse: SpotifyLastTrackResponse;

	import { Headline } from '$components/Headline';
	import { TopTracks, TopArtists, LastTrack } from '$slices/Music';

	import * as Tabs from '$primitives/Tabs';
	import { writable } from 'svelte/store';
	import Link from '$lib/Components/Link/Link.svelte';
	import * as Popper from '$lib/Primitives/Popper';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import * as RadioGroup from '$lib/Primitives/RadioGroup';
	import Filter from '$assets/Icons/24/filter.svg';
	import Close from '$assets/Icons/24/close.svg';

	const defaultSelected = 'tracks';
	const selected = writable(defaultSelected);

	let timeRange = 1;
	const timeRanges = [
		{
			label: 'last 4 Weeks',
			value: 'short',
		},
		{
			label: 'last 6 Months',
			value: 'medium',
		},
		{
			label: 'probably forever',
			value: 'long',
		},
	];
</script>

<Headline containerClass="flex items-end py-8 md:py-16">Favorite Music</Headline
>

<Headline
	as="h2"
	type="quaternary"
	id="current_track"
	containerClass="p-2 bg-white border-b border-mauve-6"
	>Last listened on Spotify</Headline
>

<LastTrack
	labelledby="current_track"
	{lastTrackResponse}
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

	<Tabs.List
		ariaLabel="My Favorite Artists and Tracks on Spotify"
		class="flex p-2 space-x-2 border-t border-mauve-6"
	>
		<Tabs.Trigger
			value="tracks"
			class="flex-grow border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 px-4 py-2 rounded-l-full {$selected ===
			'tracks'
				? 'bg-purple-5'
				: 'bg-white'}"
		>
			<Headline as="h2" unstyled id="top_tracks" type="secondary">Tracks</Headline
			>
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
			>
				<Headline as="h2" id="timeHeadline" type="tertiary" class="border-b-0">
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
							(range) => range.value === e.detail.value,
						))}
				>
					{#each timeRanges as range}
						<!-- content here -->
						<div class="flex mb-2 space-x-2 last:mb-0">
							<RadioGroup.Item
								value={range.value}
								id={range.value}
								class="w-6 h-6 p-1 bg-white border rounded-full b border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
							>
								<RadioGroup.Indicator
									class="block w-full h-full p-1 rounded-full bg-plum-5"
								/>
							</RadioGroup.Item>
							<label
								for={range.value}
								on:click={(e) => e.stopPropagation()}
								class="cursor-pointer "
							>
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
	</Tabs.List>
	<Tabs.Content
		value="tracks"
		class="border-t border-b bg-white/[.85] border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1"
	>
		<TopTracks
			labelledby="top_tracks"
			topTracksResponse={topTracksResponses[timeRange] ??
				topTracksResponses[0]}
		/>
	</Tabs.Content>
	<Tabs.Content
		value="artists"
		class="border-t border-b bg-white/[.85] border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1"
	>
		<TopArtists
			labelledby="top_artists"
			topArtistsResponse={topArtistsResponses[timeRange] ??
				topArtistsResponses[0]}
		/>
	</Tabs.Content>
</Tabs.Root>

<div class="pt-8 pb-32 text-center md:pt-16">
	<p>Made with:</p>
	<p>
		<Link type="secondary" href="https://spotify.com">Spotify</Link>
		💚
		<Link type="secondary" href="https://supabase.com/">Supabase</Link>
	</p>
</div>
