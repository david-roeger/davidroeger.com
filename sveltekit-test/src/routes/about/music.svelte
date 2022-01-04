<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type {
		ErrorBody,
		LastTrack,
		SpotifyLastTrackResponse,
		SpotifyTopArtistsResponse,
		SpotifyTopTracksResponse
	} from './types';

	import { TopTracksSection } from '$slices/Music';

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

	export let lastTrackResponse: SpotifyLastTrackResponse;

	import { Headline } from '$components/Headline';
	import TopArtistsSection from '$lib/Slices/Music/TopArtistsSection.svelte';
	import LastTrackSection from '$lib/Slices/Music/LastTrackSection.svelte';
	let lastTrack: LastTrack | ErrorBody;
	if (lastTrackResponse.ok && 'item' in lastTrackResponse.body) {
		lastTrack = lastTrackResponse.body.item;
	}
	if (!lastTrackResponse.ok && 'error' in lastTrackResponse.body) {
		lastTrack = lastTrackResponse.body.error;
	}
</script>

<Headline class="flex items-end py-4 pt-8 md:py-8 md:pt-16">Music</Headline>
<LastTrackSection {lastTrackResponse} />
<TopArtistsSection topArtistsResponse={topArtistsResponses[0]} />
<TopTracksSection topTracksResponse={topTracksResponses[0]} />
