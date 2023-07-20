import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { pg } from '@lucia-auth/adapter-postgresql';

import { env } from '$env/dynamic/private';
import client from '../Supabase/client';

// expect error
export const auth = lucia({
	env: 'DEV', // "PROD" if deployed to HTTPS
	middleware: sveltekit(),
	adapter: pg(client, {
		user: 'auth_user',
		key: 'user_key',
		session: 'user_session'
	}),
	getUserAttributes: (data) => {
		return {
			name: data.name,
			role: data.role
		};
	}
});

export type Auth = typeof auth;
