logger.page('_api/ping: +server.ts');
// ----------------------------------------------------------------

import { json } from '@sveltejs/kit';

import { logger } from '$utils/logger';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	logger.page('_api/ping: +server.ts // GET');
	// ----------------------------------------------------------------

	return json({ message: 'pong' });
};
