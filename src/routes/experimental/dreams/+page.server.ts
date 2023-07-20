console.info('experimental/dreams: +page.server.ts');
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

import client from '$lib/Utils/Supabase/client';

export const load: PageServerLoad = async ({ locals }) => {
	console.info('experimental/dreams: +page.server.ts // load');

	const dreams = await client.query('SELECT * from dreams');

	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/experimental/dreams/login');
	return {
		user: session.user,
		dreams: []
	};
};

export const prerender = false;
