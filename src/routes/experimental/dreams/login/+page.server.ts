logger.page('experimental/dream/login: +page.server.ts');
// ----------------------------------------------------------------

import { fail, redirect } from '@sveltejs/kit';

import { LuciaError } from 'lucia';

import { auth } from '$utils/Lucia/lucia';
import { logger } from '$utils/logger';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	logger.page('experimental/dream/login: +page.server.ts // load');
	// ----------------------------------------------------------------

	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/experimental/dreams');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		logger.page(
			'experimental/dream/login: +page.server.ts // Action // default'
		);

		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		// basic check
		if (typeof email !== 'string') {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (
			typeof password !== 'string' ||
			password.length < 1 ||
			password.length > 255
		) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		try {
			// find user by key
			// and validate password
			const user = await auth.useKey('email', email, password);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			if (e instanceof LuciaError) {
				if (
					e.message === 'AUTH_INVALID_KEY_ID' ||
					e.message === 'AUTH_INVALID_PASSWORD'
				) {
					return fail(400, {
						message: 'Incorrect username or password'
					});
				}

				return fail(400, {
					message: e.message
				});
			}
			logger.error(e);
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/experimental/dreams');
	}
};
