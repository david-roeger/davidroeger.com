logger.page('experimental/dreams: +page.ts');
// ----------------------------------------------------------------

import type { Pageable } from '$components/Pagination/types';

import { parseNumber } from '$utils/Url';
import { logger } from '$utils/logger';

import type { Dream } from '$types';

import type { PageLoad } from './$types';

import {
	DREAMS_DEFAULT_PAGE,
	DREAMS_DEFAULT_SIZE,
	DREAMS_KEYS
} from './constants';

export const load: PageLoad = async ({ fetch, data, url, parent }) => {
	logger.page('experimental/dreams: +page.ts // load');
	// ----------------------------------------------------------------

	const { queryClient } = await parent();
	const { user } = data;

	const size = parseNumber({
		url,
		key: 'size',
		defaultNumber: DREAMS_DEFAULT_SIZE
	});
	const page = parseNumber({
		url,
		key: 'page',
		defaultNumber: DREAMS_DEFAULT_PAGE
	});

	const queryFn = async () =>
		await fetch(`/_api/dreams?size=${size}&page=${page}`).then(
			async (res) => {
				const data = await res.json();
				if (!res.ok) throw data;
				const dreams = data as Pageable<Dream>;
				dreams.rows.forEach((dream) => {
					queryClient.setQueryData(DREAMS_KEYS.id(dream.id), dream);
				});
				const rows = dreams.rows.map((dream) => dream.id);
				return {
					...dreams,
					rows
				};
			}
		);

	await queryClient.prefetchQuery({
		queryKey: DREAMS_KEYS.page(size, page),
		queryFn
	});

	return {
		size,
		page,
		user
	};
};
