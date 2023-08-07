import { error } from '@sveltejs/kit';

import type { TopArtist, TopTrack } from '$components/Music/types';

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
	accessToken: string,
	type: 'tracks' | 'artists',
	range: 'short_term' | 'medium_term' | 'long_term'
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
	accessToken: string,
	range: 'short_term' | 'medium_term' | 'long_term'
): Promise<TopTrack[]> => {
	return await getTop(accessToken, 'tracks', range);
};

export const getTopArtists = async (
	accessToken: string,
	range: 'short_term' | 'medium_term' | 'long_term'
): Promise<TopArtist[]> => {
	return await getTop(accessToken, 'artists', range);
};
