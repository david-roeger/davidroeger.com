logger.page('_api/emojis: +server.ts');
// ----------------------------------------------------------------

import { error, json } from '@sveltejs/kit';

import { getRandomEmojis, logger } from '$utils';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	logger.page('_api/emojis: +server.ts // GET');
	// ----------------------------------------------------------------

	const limit = Number(url.searchParams.get('limit') ?? 10);

	if (Number.isNaN(limit)) {
		throw error(400, 'limit is not valid');
	}

	const emojis = getRandomEmojis(limit);

	return json(emojis);
};
