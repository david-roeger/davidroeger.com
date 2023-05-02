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
				cacheTime: Infinity,
				staleTime: 1000 * 60 * 5, // 5 minutes
				refetchOnWindowFocus: false
			}
		}
	});

	return { queryClient };
};

export const prerender = true;
