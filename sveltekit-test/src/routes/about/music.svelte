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
</script>

<Headline class="flex items-end py-4 pt-8 md:py-8 md:pt-16">Music</Headline>
<LastTrack {lastTrackResponse} />
<TopArtists topArtistsResponse={topArtistsResponses[0]} />
<TopTracks topTracksResponse={topTracksResponses[0]} />
