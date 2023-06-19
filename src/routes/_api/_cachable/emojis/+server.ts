console.info('_api/_cachable/emojis: +server.ts');

import { getRandomEmojis } from '$lib/Utils';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	console.info('_api/_cachable/emojis: +server.ts // GET');

	const limit = Number(url.searchParams.get('limit') ?? 10);

	if (Number.isNaN(limit)) {
		throw error(400, 'limit is not valid');
	}

	const emojis = getRandomEmojis(limit);

	return json(emojis);
};
