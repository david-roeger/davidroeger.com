logger.page('experimental/dream/signup: +layout.server.ts');
// ----------------------------------------------------------------

import { fail, redirect } from '@sveltejs/kit';

import { LuciaError } from 'lucia';

import { auth } from '$utils/Lucia/lucia';
import { logger } from '$utils/logger';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	logger.page('experimental/dream/signup: +layout.server.ts // load');
	// ----------------------------------------------------------------

	const session = await locals.auth.validate();
	if (session) redirect(302, '/experimental/dreams');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		logger.page(
			'experimental/dream/signup: +layout.server.ts // Action // default'
		);

		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const name = formData.get('name');
		// basic check
		if (typeof email !== 'string') {
			return fail(400, {
				message: 'Invalid email'
			});
		}

		if (typeof name !== 'string' || name.length < 4 || name.length > 31) {
			return fail(400, {
				message: 'Invalid name'
			});
		}
		if (
			typeof password !== 'string' ||
			password.length < 6 ||
			password.length > 255
		) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		try {
			const user = await auth.createUser({
				key: {
					providerId: 'email', // auth method
					providerUserId: email, // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					name,
					role: 'user'
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			// this part depends on the database you're using
			// check for unique constraint error in user table
			if (e instanceof LuciaError) {
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
		redirect(302, '/experimental/dreams');
	}
};
