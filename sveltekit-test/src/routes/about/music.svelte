<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type {
		SpotifyLastTrackResponse,
		SpotifyTopArtistsResponse,
		SpotifyTopTracksResponse
	} from './types';

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
				topArtistsLongResponse
			} = body;

			return {
				props: {
					lastTrackResponse: lastTrackResponse as SpotifyLastTrackResponse,
					topTracksResponses: [
						topTracksShortResponse,
						topTracksMediumResponse,
						topTrackLongResponse
					] as SpotifyTopTracksResponse[],
					topArtistsResponses: [
						topArtistsShortResponse,
						topArtistsMediumResponse,
						topArtistsLongResponse
					] as SpotifyTopArtistsResponse[]
				}
			};
		}
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
	import Detail from '$lib/Components/Music/Detail.svelte';
	import Link from '$lib/Components/Link/Link.svelte';

	const defaultSelected = 'tracks';
	const selected = writable(defaultSelected);
</script>

<svelte:head>
	<title>DR | About | Music</title>
</svelte:head>

<Headline class="flex items-end py-8 md:py-16">Music</Headline>

<Headline unstyled id="current_track" type="secondary" class="p-2 bg-white border-b border-mauve-5"
	>Current Track</Headline
>
<LastTrack
	labelledby="current_track"
	{lastTrackResponse}
	class="border-b bg-white/[85]  border-mauve-5"
/>
<div class="h-8 p-2 mb-8 bg-white border-b border-mauve-5 md:mb-16" />

<Tabs.Root defaultValue={defaultSelected} on:valueChange={(e) => ($selected = e.detail.value)}>
	<Tabs.List ariaLabel="" class="flex p-2 space-x-2 bg-white border-t border-mauve-5">
		<Tabs.Trigger
			value="tracks"
			class={`flex-grow border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 px-4 py-2 rounded-l-full  ${
				$selected === 'tracks' ? 'bg-purple-5' : 'bg-white'
			}`}
		>
			<Headline unstyled id="top_tracks" type="secondary">Top Tracks</Headline>
		</Tabs.Trigger>
		<Tabs.Trigger
			value="artists"
			class={`flex-grow border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 px-4 py-2 rounded-r-full  ${
				$selected === 'artists' ? 'bg-purple-5' : 'bg-white'
			}`}
		>
			<Headline unstyled id="top_artists" type="secondary">Top Artists</Headline>
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content
		value="tracks"
		class="border-t border-b bg-white/[85] border-mauve-5 focus:outline-none ring-mauve-5 focus:ring-1"
	>
		<TopTracks labelledby="top_tracks" topTracksResponse={topTracksResponses[0]} />
	</Tabs.Content>
	<Tabs.Content
		value="artists"
		class="border-t border-b bg-white/[85] border-mauve-5 focus:outline-none ring-mauve-5 focus:ring-1"
	>
		<TopArtists labelledby="top_artists" topArtistsResponse={topArtistsResponses[0]} />
	</Tabs.Content>
</Tabs.Root>

<div class="py-8 text-center md:py-16">
	<p>Made with:</p>
	<p>
		<Link type="secondary" href="https://spotify.com">Spotify</Link>
		💚
		<Link type="secondary" href="https://supabase.com/">Supabase</Link>
	</p>
</div>
