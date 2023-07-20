console.info('experimental/dreams: +layout.server.ts');
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	console.info('experimental/dreams: +layout.server.ts // load');

	return {};
}) satisfies LayoutServerLoad;

export const prerender = false;
