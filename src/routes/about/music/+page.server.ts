console.info('about/music: +page.server.ts');

import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REFRESH_TOKEN
} from '$env/static/private';

import { error } from '@sveltejs/kit';
import type { TopTrack, TopArtist, LastTrack } from '$components/Music/types';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	console.info('about/music: +page.server.ts // load');

	const params = new URLSearchParams({
		clientId: SPOTIFY_CLIENT_ID,
		clientSecret: SPOTIFY_CLIENT_SECRET,
		refreshToken: SPOTIFY_REFRESH_TOKEN
	});
	const response = await fetch(`/_api/music?${params.toString()}`);
	// if access token is okay
	if (response.ok) {
		const data = (await response.json()) as
			| {
					lastTrack: string | LastTrack;
					topTracksShort: string | TopTrack[];
					topTracksMedium: string | TopTrack[];
					topTracksLong: string | TopTrack[];
					topArtistsShort: string | TopArtist[];
					topArtistsMedium: string | TopArtist[];
					topArtistsLong: string | TopArtist[];
			  }
			| undefined;
		if (data) {
			return data;
		}
	}

	throw error(500, "Couldn't load music data");
};

export const prerender = false;
