logger.page('experimental: +page.ts');
// ----------------------------------------------------------------
import { redirect } from '@sveltejs/kit';

import { logger } from '$utils';

export const load = async () => {
	logger.page('experimental: +page.ts // load');
	// ----------------------------------------------------------------

	throw redirect(302, '/projects#experimental');
};
