console.info('about/music: +page.server.ts');

import {
	generateAccessToken,
	getTopTracks,
	getTopArtists,
	getLastTrack
} from './spotify';
import { error } from '@sveltejs/kit';
import type {
	SpotifyTopTracksResponse,
	SpotifyTopArtistsResponse,
	SpotifyLastTrackResponse
} from '$components/Music/types';

import type { PageServerLoad } from './$types';

type SpotifyResponse =
	| SpotifyTopTracksResponse
	| SpotifyTopArtistsResponse
	| SpotifyLastTrackResponse;

const createResponse = async (
	response: Response,
	errorMessage: string
): Promise<SpotifyResponse> => {
	if (response.ok) {
		return {
			ok: true,
			data: await response.json()
		};
	}
	return {
		ok: false,
		message: errorMessage
	};
};

export const load: PageServerLoad = async () => {
	console.info('about/music: +page.server.ts // load');

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
			topArtistsLong
		]).then(async (responses) => {
			const lastTrackResponse = (await createResponse(
				responses[0],
				'Error fetching last track'
			)) as SpotifyLastTrackResponse;

			const topTracksShortResponse = (await createResponse(
				responses[1],
				'Error fetching top tracks short'
			)) as SpotifyTopTracksResponse;

			const topTracksMediumResponse = (await createResponse(
				responses[2],
				'Error fetching top tracks medium'
			)) as SpotifyTopTracksResponse;

			const topTrackLongResponse = (await createResponse(
				responses[3],
				'EError fetching top tracks long'
			)) as SpotifyTopTracksResponse;

			const topArtistsShortResponse = (await createResponse(
				responses[4],
				'Error fetching top artists short'
			)) as SpotifyTopArtistsResponse;

			const topArtistsMediumResponse = (await createResponse(
				responses[5],
				'Error fetching top artists medium'
			)) as SpotifyTopArtistsResponse;

			const topArtistsLongResponse = (await createResponse(
				responses[6],
				'Error fetching top artists long'
			)) as SpotifyTopArtistsResponse;

			return {
				lastTrackResponse,
				topTracksShortResponse,
				topTracksMediumResponse,
				topTrackLongResponse,
				topArtistsShortResponse,
				topArtistsMediumResponse,
				topArtistsLongResponse
			};
		});

		return response;
	}

	throw error(500, "Couldn't load music data");
};

export const prerender = false;
