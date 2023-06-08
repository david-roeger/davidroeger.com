console.info('_api/music: +server.ts');

import z from 'zod';
import { error, json } from '@sveltejs/kit';

import { baseRequest, getTopArtists, getTopTracks } from './utils';

import type {
	CurrentTrack,
	LastTrack,
	RecentTrack
} from '$lib/Components/Music/types';

import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { rangeSchema as baseRangeSchema } from '$routes/about/music/constants';

const getAccessToken = async ({
	clientId,
	clientSecret,
	refreshToken
}: {
	clientId: string;
	clientSecret: string;
	refreshToken: string;
}): Promise<string> => {
	console.info('_api/music: +server.ts // GET // getAccessToken');

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${Buffer.from(
				clientId + ':' + clientSecret
			).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		})
	});

	const body = await response.json();
	if (response.ok) {
		const { access_token } = body;
		if (access_token) {
			return access_token as string;
		}

		throw error(500, 'Client Recieved no Access Token from server');
	}

	const { error: errorFromBody } = body;
	throw error(500, errorFromBody);
};

const getCurrentTrack = async (
	accessToken: string
): Promise<CurrentTrack | false> => {
	console.info('_api/music: +server.ts // GET // getCurrentTrack');

	const response = await baseRequest(
		accessToken,
		'/player/currently-playing/?market=DE&additional_types=track'
	);

	if (response.status === 204) {
		return false;
	}

	const body = await response.json();
	if (response.ok) {
		const { item } = body;
		if (item) {
			if (body.currently_playing_type !== 'track') {
				return false;
			}

			return item as CurrentTrack;
		}

		throw error(500, 'Client Recieved no Item from server');
	}

	const { error: errorFromBody } = body;
	throw error(500, errorFromBody);
};

const getRecentTrack = async (accessToken: string): Promise<RecentTrack> => {
	console.info('_api/music: +server.ts // GET // getRecentTrack');

	const response = await baseRequest(
		accessToken,
		'/player/recently-played?limit=1'
	);

	const body = await response.json();
	if (response.ok) {
		const { items } = body;
		if (items && items.length) {
			return items[0].track as RecentTrack;
		}
		throw error(500, 'Client Recieved no Items from server');
	}

	const { error: errorFromBody } = body;
	throw error(500, errorFromBody);
};

const getLastTrack = async (accessToken: string): Promise<LastTrack> => {
	const current = await getCurrentTrack(accessToken);
	if (current !== false) return current;
	return await getRecentTrack(accessToken);
};

let accessToken: string;

const typeSchema = z.enum(['lastTrack', 'tracks', 'artists']);

const rangeSchema = baseRangeSchema.transform((val) => {
	if (val === 'short') return 'short_term';
	if (val === 'medium') return 'medium_term';
	if (val === 'long') return 'long_term';
	return val;
});

export const GET: RequestHandler = async ({ url }) => {
	console.info('_api/music: +server.ts // GET');

	const type = url.searchParams.get('type');
	const range = url.searchParams.get('range');

	const parsedType = typeSchema.safeParse(type);
	if (!parsedType.success) {
		throw error(400);
	}

	const parsedRange = rangeSchema.safeParse(range);
	if (!parsedRange.success && type !== 'lastTrack') {
		throw error(400);
	}

	if (!accessToken) {
		accessToken = await getAccessToken({
			clientId: env.SPOTIFY_CLIENT_ID,
			clientSecret: env.SPOTIFY_CLIENT_SECRET,
			refreshToken: env.SPOTIFY_REFRESH_TOKEN
		});
	}
	if (!accessToken) throw error(500, "Couldn't load music data");

	try {
		if (type === 'lastTrack') {
			const lastTrack = await getLastTrack(accessToken);
			return json(lastTrack);
		}
		if ('data' in parsedRange) {
			if (type === 'tracks') {
				const topTracks = await getTopTracks(
					accessToken,
					parsedRange.data
				);
				return json(topTracks);
			}
			if (type === 'artists') {
				const topArtists = await getTopArtists(
					accessToken,
					parsedRange.data
				);
				return json(topArtists);
			}
		}
	} catch {
		throw error(500, "Couldn't load music data");
	}

	throw error(500, "Couldn't load music data");
};
