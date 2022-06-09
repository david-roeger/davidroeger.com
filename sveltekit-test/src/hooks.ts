import type { GetSession, Handle } from '@sveltejs/kit';
import { handleCallback, handleUser } from '@supabase/auth-helpers-sveltekit';

import { sequence } from '@sveltejs/kit/hooks';

export const handle: Handle = sequence(
	handleCallback({
		cookieOptions: { lifetime: 1 * 365 * 24 * 60 * 60 },
	}),
	handleUser({
		cookieOptions: { lifetime: 1 * 365 * 24 * 60 * 60 },
	}),
);

export const getSession: GetSession = async (event) => {
	const { user, accessToken } = event.locals;

	return {
		user,
		accessToken,
	};
};
