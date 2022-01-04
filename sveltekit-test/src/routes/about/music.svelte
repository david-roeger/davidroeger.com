<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type {
		ErrorBody,
		LastTrack,
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
			console.log(topArtistsLongResponse);
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
	console.log(topArtistsResponses);

	export let lastTrackResponse: SpotifyLastTrackResponse;
	let lastTrack: LastTrack | ErrorBody;
	if (lastTrackResponse.ok && 'item' in lastTrackResponse.body) {
		lastTrack = lastTrackResponse.body.item;
	}
	if (!lastTrackResponse.ok && 'error' in lastTrackResponse.body) {
		lastTrack = lastTrackResponse.body.error;
	}

	const validateTopTracksResponse = (topTracksResponse: SpotifyTopTracksResponse) => {
		if (topTracksResponse.ok) return true;
		if (!topTracksResponse.ok) return false;
		return undefined;
	};

	const validateTopArtistsResponse = (topArtistsResponse: SpotifyTopArtistsResponse) => {
		if (topArtistsResponse.ok) return true;
		if (!topArtistsResponse.ok) return false;
		return undefined;
	};
</script>

{#if typeof lastTrack === 'object' && 'name' in lastTrack}
	<p>{lastTrack.name}</p>
{:else if typeof lastTrack === 'string'}
	<p>{lastTrack}</p>
{:else if typeof lastTrack === 'object'}
	<p>{lastTrack.status} {lastTrack.message}</p>
{/if}

---
{#each topTracksResponses as topTracksResponse}
	{#if validateTopTracksResponse(topTracksResponse) === true && 'items' in topTracksResponse.body}
		{#each topTracksResponse.body.items as topTrack (topTrack.id)}
			<p>{topTrack.name}</p>
		{/each}
	{:else if validateTopTracksResponse(topTracksResponse) === false && 'error' in topTracksResponse.body}
		{#if typeof topTracksResponse.body.error === 'string'}
			<p>{topTracksResponse.body.error}</p>
		{:else if typeof topTracksResponse === 'object'}
			<p>{topTracksResponse.body.error.status} {topTracksResponse.body.error.message}</p>
		{/if}
	{/if}
	---
{:else}
	<span>No top Tracks</span>
{/each}
--- --- --- ---
{#each topArtistsResponses as topArtistsResponse}
	{#if validateTopArtistsResponse(topArtistsResponse) === true && 'items' in topArtistsResponse.body}
		{#each topArtistsResponse.body.items as topArtist (topArtist.id)}
			<p>{topArtist.name}</p>
		{/each}
	{:else if validateTopArtistsResponse(topArtistsResponse) === false && 'error' in topArtistsResponse.body}
		{#if typeof topArtistsResponse.body.error === 'string'}
			<p>{topArtistsResponse.body.error}</p>
		{:else if typeof topArtistsResponse === 'object'}
			<p>{topArtistsResponse.body.error.status} {topArtistsResponse.body.error.message}</p>
		{/if}
	{/if}
	---
{:else}
	<span>No top Tracks</span>
{/each}
