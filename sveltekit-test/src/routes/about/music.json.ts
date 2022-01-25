import {
	getAccessToken,
	getTopTracks,
	getTopArtists,
	getLastTrack,
} from './_spotify';
import type { RequestHandler } from '@sveltejs/kit';
import type {
	SpotifyTopTracksResponse,
	SpotifyTopArtistsResponse,
	SpotifyLastTrackResponse,
} from '$components/Music/types';

// GET /about/music.json
export const get: RequestHandler = async () => {
	// request access token
	const response = await getAccessToken();

	// if access token is
	if (response.ok) {
		// fetch all items
		const lastTrack = getLastTrack();
		const topTracksShort = getTopTracks('short_term');
		const topTracksMedium = getTopTracks('medium_term');
		const topTrackLong = getTopTracks('long_term');
		const topArtistsShort = getTopArtists('short_term');
		const topArtistsMedium = getTopArtists('medium_term');
		const topArtistsLong = getTopArtists('long_term');
		const response = Promise.all([
			lastTrack,
			topTracksShort,
			topTracksMedium,
			topTrackLong,
			topArtistsShort,
			topArtistsMedium,
			topArtistsLong,
		]).then((responses) => {
			const body = {
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
			return { status: 200, body: body };
		});
		return await response;
	}
	return { status: response.status, body: response.body };
};
