import type { PageServerLoad } from './$types';

import client from '$lib/Utils/Supabase/client';

export const load: PageServerLoad = async () => {
	const dreams = await client.query('SELECT * from dreams');
	return {
		dreams: dreams.rows
	};
};
