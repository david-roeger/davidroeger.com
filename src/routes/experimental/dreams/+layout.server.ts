logger.page('experimental/dreams: +layout.server.ts');
// ----------------------------------------------------------------

import { logger } from '$utils/logger';

import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	logger.page('experimental/dreams: +layout.server.ts // load');
	// ----------------------------------------------------------------

	return {};
}) satisfies LayoutServerLoad;

export const prerender = false;
