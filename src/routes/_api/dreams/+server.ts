import client from '$lib/Utils/Db/client';

import { json } from '@sveltejs/kit';

import * as z from 'zod';

import type { RequestHandler } from './$types';
import type { Dream } from '$lib/types';
import {
	DREAMS_DEFAULT_PAGE,
	DREAMS_DEFAULT_SIZE
} from '$routes/experimental/dreams/constants';
import type { Pageable } from '$components/Pagination/types';

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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const GET: RequestHandler = async ({ url }) => {
	await sleep(1000);
	const size = ensurePositiveInteger(DREAMS_DEFAULT_SIZE).parse(
		safeUrlParam(url, 'size')
	);
	const page = ensurePositiveInteger(DREAMS_DEFAULT_PAGE).parse(
		safeUrlParam(url, 'page')
	);

	const total = client.query('SELECT COUNT(*) AS total from dreams');

	const offset = (page - 1) * size;
	const dreams = client.query(
		'SELECT * from dreams ORDER BY created_at DESC LIMIT $1 OFFSET $2',
		[size, offset]
	);

	const [totalResult, totalDreams] = await Promise.all([total, dreams]);

	const t = !Number.isNaN(parseInt(totalResult.rows[0].total))
		? parseInt(totalResult.rows[0].total)
		: 0;

	const hasPrevious = page > 1;
	const hasNext = offset + size < t;
	const last = Math.ceil(t / size);
	const previous = Math.max(Math.min(page - 1, last), 1);
	const next = Math.min(page + 1, last);

	const result: Pageable<Dream> = {
		total: t,
		current: page,
		size,
		rows: totalDreams.rows,
		hasPrevious,
		hasNext,
		previous,
		next,
		last
	};

	return json(result);
};
