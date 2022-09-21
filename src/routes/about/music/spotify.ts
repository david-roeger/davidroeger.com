// SERVER MODULE

import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REFRESH_TOKEN
} from '$env/static/private';

import { json, error } from '@sveltejs/kit';

/**
 * Methods
 */

let accessToken = '';
export const generateAccessToken = async (): Promise<Response> => {
	if (accessToken) {
		return json({ accessToken });
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${Buffer.from(
				SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
			).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: SPOTIFY_REFRESH_TOKEN
		})
	});

	const body = await response.json();
	if (response.ok) {
		const { access_token } = body;
		if (access_token) {
			accessToken = access_token;

			return json({ accessToken });
		}

		throw error(500, 'Client Recieved no Access Token from server');
	}
	const { error: errorFromBody } = body;
	return error(500, errorFromBody);
};

const baseRequest = async (
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

const getTop = async (type: string, range: string): Promise<Response> => {
	if (!accessToken) {
		return error(500, 'No Access Token present');
	}

	const response = await baseRequest(
		accessToken,
		`/top/${type}/?time_range=${range}&limit=8&offset=0`
	);

	const body = await response.json();
	if (response.ok) {
		const { items } = body;
		if (items) {
			return json({ items });
		}
		return error(500, 'Client Recieved no Items from server');
	}

	const { error: errorFromBody } = body;
	return error(500, errorFromBody);
};

export const getTopTracks = async (range: string): Promise<Response> => {
	return await getTop('tracks', range);
};

export const getTopArtists = async (range: string): Promise<Response> => {
	return await getTop('artists', range);
};

const getCurrentTrack = async (): Promise<Response> => {
	if (!accessToken) {
		return error(500, 'No Access Token present');
	}

	const response = await baseRequest(
		accessToken,
		'/player/currently-playing/?market=DE&additional_types=track'
	);

	if (response.status === 204) {
		return json({}, { status: 204 });
	}

	const body = await response.json();
	if (response.ok) {
		const { item } = body;
		if (item) {
			if (body.currently_playing_type !== 'track') {
				return json({}, { status: 204 });
			}

			return json({ item }, { status: 200 });
		}

		return error(500, 'Client Recieved no Item from server');
	}

	const { error: errorFromBody } = body;
	return error(500, errorFromBody);
};

const getRecentTrack = async (): Promise<Response> => {
	if (!accessToken) {
		return error(500, 'No Access Token present');
	}

	const response = await baseRequest(
		accessToken,
		'/player/recently-played?limit=1'
	);

	const body = await response.json();
	if (response.ok) {
		const { items } = body;
		if (items && items.length) {
			return json({ item: items[0].track });
		}
		return error(500, 'Client Recieved no Items from server');
	}

	const { error: errorFromBody } = body;
	return error(500, errorFromBody);
};

export const getLastTrack = async (): Promise<Response> => {
	const current = await getCurrentTrack();

	if (current.status === 200) return current;
	return await getRecentTrack();
};
