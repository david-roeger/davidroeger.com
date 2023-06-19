console.info('_api/_cachable/resume: +server.ts');

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import resume from './resume.json';

export const GET: RequestHandler = async () => {
	console.info('_api/_cachable/resume: +server.ts // GET');
	return json(resume);
};
