import {
	generateAccessToken,
	getTopTracks,
	getTopArtists,
	getLastTrack,
} from './spotify';
import { error } from '@sveltejs/kit';
import type {
	SpotifyTopTracksResponse,
	SpotifyTopArtistsResponse,
	SpotifyLastTrackResponse,
} from '$components/Music/types';

import type { PageServerLoad} from './$types'
// GET /api/music
export const load: PageServerLoad = async() => {
	const response = await generateAccessToken();
	// if access token is okay
	if (response.ok) {
		// fetch all items
		const lastTrack = getLastTrack();
		const topTracksShort = getTopTracks('short_term');
		const topTracksMedium = getTopTracks('medium_term');
		const topTrackLong = getTopTracks('long_term');
		const topArtistsShort = getTopArtists('short_term');
		const topArtistsMedium = getTopArtists('medium_term');
		const topArtistsLong = getTopArtists('long_term');
		const response = await Promise.all([
			lastTrack,
			topTracksShort,
			topTracksMedium,
			topTrackLong,
			topArtistsShort,
			topArtistsMedium,
			topArtistsLong,
		]).then((responses) => {
			return {
				lastTrackResponse: responses[0] as SpotifyLastTrackResponse,
				topTracksShortResponse:
					responses[1] as SpotifyTopTracksResponse,
				topTracksMediumResponse:
					responses[2] as SpotifyTopTracksResponse,
				topTrackLongResponse: responses[3] as SpotifyTopTracksResponse,
				topArtistsShortResponse:
					responses[4] as SpotifyTopArtistsResponse,
				topArtistsMediumResponse:
					responses[5] as SpotifyTopArtistsResponse,
				topArtistsLongResponse:
					responses[6] as SpotifyTopArtistsResponse,
			};
		});
		return response;
	}

	if(response.body.error) {
		throw error(response.body.error.status,  response.body.error.message);
	}

    throw error(500, "Couldn't load music data");
  }