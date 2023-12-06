logger.page('experimental/dreams: +layout.server.ts');
// ----------------------------------------------------------------

import { logger } from '$utils/logger';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	logger.page('experimental/dreams: +layout.server.ts // load');
	// ----------------------------------------------------------------

	return {};
};

export const prerender = false;
