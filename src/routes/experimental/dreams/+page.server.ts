console.info('experimental/dreams: +page.server.ts');

import type { PageServerLoad } from './$types';

import { env } from '$env/dynamic/private';
import { SUPABASE_HOST } from '$env/static/private';

console.log('@1@ host', env.SUPABASE_HOST);
console.log('@2@ host', SUPABASE_HOST);

// import client from '$lib/Utils/Supabase/client';

export const load: PageServerLoad = async () => {
	console.info('experimental/dreams: +page.server.ts // load');

	// const dreams = await client.query('SELECT * from dreams');
	return {
		dreams: []
	};
};

export const prerender = false;
