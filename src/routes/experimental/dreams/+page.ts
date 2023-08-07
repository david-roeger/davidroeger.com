logger.page('experimental/dreams: +page.ts');
// ----------------------------------------------------------------

import type { Pageable } from '$components/Pagination/types';

import { ensurePositiveInteger, safeUrlParam } from '$utils/Url';
import { logger } from '$utils';

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

	const size = ensurePositiveInteger(DREAMS_DEFAULT_SIZE).parse(
		safeUrlParam(url, 'size')
	);
	const page = ensurePositiveInteger(DREAMS_DEFAULT_PAGE).parse(
		safeUrlParam(url, 'page')
	);

	const queryFn = async () =>
		(await fetch(`/_api/dreams?size=${size}&page=${page}`))
			.json()
			.then((data) => data as Pageable<Dream>);

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
