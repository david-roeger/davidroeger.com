console.info('_api/music: +server.ts');

import { error, json } from '@sveltejs/kit';
import { authorize, baseRequest, getTopArtists, getTopTracks } from './utils';

import type {
	CurrentTrack,
	LastTrack,
	RecentTrack
} from '$lib/Components/Music/types';

import type { RequestHandler } from './$types';

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

export const getLastTrack = async (accessToken: string): Promise<LastTrack> => {
	const current = await getCurrentTrack(accessToken);
	if (current !== false) return current;
	return await getRecentTrack(accessToken);
};

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	console.info('_api/music: +server.ts // GET');

	authorize(url);

	const clientId = url.searchParams.get('clientId') as string;
	const clientSecret = url.searchParams.get('clientSecret') as string;
	const refreshToken = url.searchParams.get('refreshToken') as string;

	const accessToken = await getAccessToken({
		clientId,
		clientSecret,
		refreshToken
	});

	if (!accessToken) throw error(500, "Couldn't load music data");

	const lastTrack = getLastTrack(accessToken);
	const topTracksShort = getTopTracks('short_term', accessToken);
	const topTracksMedium = getTopTracks('medium_term', accessToken);
	const topTrackLong = getTopTracks('long_term', accessToken);
	const topArtistsShort = getTopArtists('short_term', accessToken);
	const topArtistsMedium = getTopArtists('medium_term', accessToken);
	const topArtistsLong = getTopArtists('long_term', accessToken);

	const results = await Promise.allSettled([
		lastTrack,
		topTracksShort,
		topTracksMedium,
		topTrackLong,
		topArtistsShort,
		topArtistsMedium,
		topArtistsLong
	]).then((results) => {
		const finalLastTrack =
			results[0].status === 'fulfilled'
				? results[0].value
				: 'Error fetching last track';
		const finalTopTracksShort =
			results[1].status === 'fulfilled'
				? results[1].value
				: 'Error fetching top tracks short';
		const finalTopTracksMedium =
			results[2].status === 'fulfilled'
				? results[2].value
				: 'Error fetching top tracks medium';
		const finalTopTracksLong =
			results[3].status === 'fulfilled'
				? results[3].value
				: 'Error fetching top tracks long';
		const finalTopArtistsShort =
			results[4].status === 'fulfilled'
				? results[4].value
				: 'Error fetching top artists short';
		const finalTopArtistsMedium =
			results[5].status === 'fulfilled'
				? results[5].value
				: 'Error fetching top artists medium';
		const finalTopArtistsLong =
			results[6].status === 'fulfilled'
				? results[6].value
				: 'Error fetching top artists long';

		return {
			lastTrack: finalLastTrack,
			topTracksShort: finalTopTracksShort,
			topTracksMedium: finalTopTracksMedium,
			topTracksLong: finalTopTracksLong,
			topArtistsShort: finalTopArtistsShort,
			topArtistsMedium: finalTopArtistsMedium,
			topArtistsLong: finalTopArtistsLong
		};
	});

	setHeaders({
		'Cache-Control': 'private, max-age=60'
	});

	return json(results);
};
