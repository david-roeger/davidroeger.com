import { getRandomEmojis } from '$lib/Utils';

import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const limit = Number(url.searchParams.get('limit') ?? 10);

	if (Number.isNaN(limit)) {
		throw error(400, 'limit is not valid');
	}

	const emojis = getRandomEmojis(limit);

	return json(emojis);
};
