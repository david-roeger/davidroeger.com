console.info('experimental/dreams: +page.server.ts');

import type { PageServerLoad } from './$types';

import { env } from '$env/dynamic/private';
import { SUPABASE_HOST } from '$env/static/private';
import * as t from '$env/static/private';

console.log('@1@', env.SUPABASE_HOST);
console.log('@2@', SUPABASE_HOST);
console.log('@3@', process.env.SUPABASE_HOST);

throw new Error(
	JSON.stringify({
		DP: env.SUPABASE_HOST,
		SP: SUPABASE_HOST,
		SPM: SUPABASE_HOST,
		P: process.env.SUPABASE_HOST
	})
);

// import client from '$lib/Utils/Supabase/client';

export const load: PageServerLoad = async () => {
	console.info('experimental/dreams: +page.server.ts // load');

	// const dreams = await client.query('SELECT * from dreams');
	return {
		dreams: []
	};
};

export const prerender = false;
