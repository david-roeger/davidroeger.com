console.info('_api/clearCache: +server.ts');

import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { getClient } from '$lib/Utils/Redis';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
	console.info('_api/clearCache: +server.ts // GET');

	try {
		const redis = getClient();
		const result = await redis.flushdb();
		return json(result);
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
