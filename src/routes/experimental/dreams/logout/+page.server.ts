logger.page('experimental/dream/logout: +page.server.ts');
// ----------------------------------------------------------------

import { redirect } from '@sveltejs/kit';

import { logger } from '$utils/logger';
import { auth } from '$utils/Lucia/lucia';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals }) => {
		logger.page(
			'experimental/dream/logout: +page.server.ts // Action // default'
		);

		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);

		throw redirect(302, '/experimental/dreams/login');
	}
};
