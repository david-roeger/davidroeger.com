console.info('index: +layout.ts');

import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	console.info('index: +layout.ts // load');
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 1000 * 30, //30 seconds
				cacheTime: 1000 * 30,
				refetchOnMount: false,
				refetchOnWindowFocus: false
			}
		}
	});

	return { queryClient };
};

export const prerender = true;
