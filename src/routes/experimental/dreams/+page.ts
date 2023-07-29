console.info('experimental/dreams: +page.ts');

import * as z from 'zod';

import type { Pageable } from '$components/Pagination/types';
import type { Dream } from '$lib/types';

import {
	DREAMS_DEFAULT_PAGE,
	DREAMS_DEFAULT_SIZE,
	DREAMS_KEYS
} from './constants';

import type { PageLoad } from './$types';

const safeUrlParam = (url: URL, key: string) => {
	const value = url.searchParams.get(key);
	if (value === null) return undefined;
	return value;
};

const ensurePositiveInteger = (d: number) => {
	return z.coerce
		.number()
		.min(1)
		.transform((v) => v ?? d)
		.catch(d)
		.default(d);
};

export const load: PageLoad = async ({ fetch, data, url, parent }) => {
	console.info('experimental/dreams: +page.ts // load');

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
