const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

import type { ErrorBody, SpotifyResponse } from '$components/Music/types';

/**
 * Utils
 */

const createErrorBody = (status: number, error_description: string) => {
	const body: ErrorBody = { status: status, message: error_description };
	return { error: body };
};

const createSpotifyResponse = (
	status: number,
	ok: boolean,
	body: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	}
) => {
	return {
		ok: ok,
		status: status,
		body: body
	};
};

/**
 * Methods
 */

let accessToken = '';
export const getAccessToken = async (): Promise<SpotifyResponse> => {
	if (accessToken) {
		return createSpotifyResponse(200, true, {});
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
				'base64'
			)}`,
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

			return createSpotifyResponse(200, true, {});
		}

		return createSpotifyResponse(
			500,
			false,
			createErrorBody(500, 'Client Recieved no Access Token from server')
		);
	}
	const { error } = body;
	return createSpotifyResponse(response.status, response.ok, { error: error });
};

const baseRequest = async (accessToken: string, params: string): Promise<Response> => {
	const res = await fetch(`https://api.spotify.com/v1/me${params}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});
	return res;
};

const getTop = async (type: string, range: string): Promise<SpotifyResponse> => {
	if (!accessToken) {
		return createSpotifyResponse(400, false, createErrorBody(400, 'No Access Token present'));
	}

	const response = await baseRequest(
		accessToken,
		`/top/${type}/?time_range=${range}&limit=8&offset=0`
	);

	const body = await response.json();
	if (response.ok) {
		const { items } = body;
		if (items) {
			return createSpotifyResponse(200, true, { items: items });
		}
		return createSpotifyResponse(
			500,
			false,
			createErrorBody(500, 'Client Recieved no Items from server')
		);
	}

	const { error } = body;
	return createSpotifyResponse(response.status, response.ok, { error: error });
};

export const getTopTracks = async (range: string): Promise<SpotifyResponse> => {
	return await getTop('tracks', range);
};

export const getTopArtists = async (range: string): Promise<SpotifyResponse> => {
	return await getTop('artists', range);
};

const getCurrentTrack = async (): Promise<SpotifyResponse> => {
	if (!accessToken) {
		return createSpotifyResponse(400, false, createErrorBody(400, 'No Access Token present'));
	}

	const response = await baseRequest(
		accessToken,
		'/player/currently-playing/?market=DE&additional_types=track'
	);

	if (response.status === 204) {
		return createSpotifyResponse(204, true, createErrorBody(204, 'Not Available'));
	}

	const body = await response.json();
	if (response.ok) {
		const { item } = body;
		if (item) {
			if (body.currently_playing_type !== 'track') {
				return createSpotifyResponse(204, true, createErrorBody(204, 'Not Available'));
			}

			return createSpotifyResponse(200, true, { item: item });
		}
		return createSpotifyResponse(
			500,
			false,
			createErrorBody(500, 'Client Recieved no Item from server')
		);
	}

	const { error } = body;
	return createSpotifyResponse(response.status, response.ok, { error: error });
};

const getRecentTrack = async (): Promise<SpotifyResponse> => {
	if (!accessToken) {
		return createSpotifyResponse(400, false, createErrorBody(400, 'No Access Token present'));
	}

	const response = await baseRequest(accessToken, '/player/recently-played?limit=1');

	const body = await response.json();
	if (response.ok) {
		const { items } = body;
		if (items && items.length) {
			return createSpotifyResponse(200, true, { item: items[0].track });
		}
		return createSpotifyResponse(
			500,
			false,
			createErrorBody(500, 'Client Recieved no Items from server')
		);
	}

	const { error } = body;
	return createSpotifyResponse(response.status, response.ok, { error: error });
};

export const getLastTrack = async (): Promise<SpotifyResponse> => {
	const current = await getCurrentTrack();

	if (current.status === 200) return current;
	return await getRecentTrack();
};
