console.info('_api/resume: +server.ts');

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import resume from './resume.json';

export const GET: RequestHandler = async () => {
	console.info('_api/resume: +server.ts // GET');
	return json(resume);
};
