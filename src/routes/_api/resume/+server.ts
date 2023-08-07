logger.page('_api/resume: +server.ts');

import { json } from '@sveltejs/kit';

import { logger } from '$utils';

import type { RequestHandler } from './$types';

import resume from './resume.json';

export const GET: RequestHandler = async () => {
	logger.page('_api/resume: +server.ts // GET');
	// ----------------------------------------------------------------

	return json(resume);
};
