console.info('_api/ping: +server.ts');

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// console.info('_api/ping: +server.ts // GET');
	return json({ message: 'pong' });
};
