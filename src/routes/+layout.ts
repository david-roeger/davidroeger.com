logger.page('index: +layout.ts');
// ----------------------------------------------------------------

import { QueryClient } from '@tanstack/svelte-query';

import { browser } from '$app/environment';

import { logger } from '$utils/logger';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	logger.page('index: +layout.ts // load');
	// ----------------------------------------------------------------

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				gcTime: Infinity,
				staleTime: 1000 * 60 * 5, // 5 minutes
				refetchOnWindowFocus: false
			}
		}
	});

	return { ...data, queryClient };
};

export const prerender = true;
