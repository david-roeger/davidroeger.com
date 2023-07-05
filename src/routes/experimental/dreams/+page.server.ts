console.info('experimental/dreams: +page.server.ts');

import type { PageServerLoad } from './$types';

// import client from '$lib/Utils/Supabase/client';

export const load: PageServerLoad = async () => {
	console.info('experimental/dreams: +page.server.ts // load');

	// const dreams = await client.query('SELECT * from dreams');
	return {
		dreams: []
	};
};

export const prerender = false;
