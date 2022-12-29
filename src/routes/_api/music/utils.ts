import { error } from '@sveltejs/kit';

import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REFRESH_TOKEN
} from '$env/static/private';
import type { TopArtist, TopTrack } from '$lib/Components/Music/types';

export const authorize = (url: URL) => {
	const clientId = url.searchParams.get('clientId');
	const clientSecret = url.searchParams.get('clientSecret');
	const refreshToken = url.searchParams.get('refreshToken');

	if (
		clientId !== SPOTIFY_CLIENT_ID ||
		clientSecret !== SPOTIFY_CLIENT_SECRET ||
		refreshToken !== SPOTIFY_REFRESH_TOKEN
	) {
		throw error(401);
	}
};

export const baseRequest = async (
	accessToken: string,
	params: string
): Promise<Response> => {
	return fetch(`https://api.spotify.com/v1/me${params}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});
};

export const getTop = async <T>(
	type: 'tracks' | 'artists',
	range: 'short_term' | 'medium_term' | 'long_term',
	accessToken: string
): Promise<T> => {
	const response = await baseRequest(
		accessToken,
		`/top/${type}/?time_range=${range}&limit=8&offset=0`
	);

	const body = await response.json();
	if (response.ok) {
		const { items } = body;
		if (items) {
			return items as T;
		}
		throw error(500, 'Client Recieved no Items from server');
	}

	const { error: errorFromBody } = body;
	throw error(500, errorFromBody);
};

export const getTopTracks = async (
	range: 'short_term' | 'medium_term' | 'long_term',
	accessToken: string
): Promise<TopTrack[]> => {
	console.info(`_api/music: +server.ts // GET // getTopTracks // ${range}`);
	return await getTop('tracks', range, accessToken);
};

export const getTopArtists = async (
	range: 'short_term' | 'medium_term' | 'long_term',
	accessToken: string
): Promise<TopArtist[]> => {
	console.info(`_api/music: +server.ts // GET // getTopArtists // ${range}`);
	return await getTop('artists', range, accessToken);
};
