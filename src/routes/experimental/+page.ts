console.info('experimental: +page.ts');

import { redirect } from '@sveltejs/kit';

export const load = async () => {
	console.info('experimental: +page.ts // load');

	throw redirect(302, '/projects#experimental');
};
