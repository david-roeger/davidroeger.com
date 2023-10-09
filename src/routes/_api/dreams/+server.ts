logger.page('_api/dreams: +server.ts');
// ----------------------------------------------------------------

import { error, json } from '@sveltejs/kit';

import client from '$utils/Db/client';

import type { RequestHandler } from './$types';
import {
	DREAMS_DEFAULT_PAGE,
	DREAMS_DEFAULT_SIZE
} from '$routes/experimental/dreams/constants';
import type { Pageable } from '$components/Pagination/types';
import { parseNumber } from '$utils/Url';
import type { Dream } from '$types';
import { logger } from '$utils/logger';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const GET: RequestHandler = async ({ url, locals }) => {
	logger.page('_api/dreams: +server.ts // GET');

	const session = await locals.auth.validate();
	if (!session) throw error(401, 'Unauthorized');

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

	logger.page(
		`_api/dreams: +server.ts // GET // page: ${page} // size: ${size}`
	);

	const total = client.query(
		'SELECT COUNT(*) AS total from dreams WHERE created_by = $1',
		[session.user.userId]
	);

	const offset = (page - 1) * size;
	const dreams = client.query(
		'SELECT * from dreams WHERE created_by = $3 ORDER BY created_at DESC LIMIT $1 OFFSET $2',
		[size, offset, session.user.userId]
	);

	const [totalResult, totalDreams] = await Promise.all([total, dreams]);

	const t = !Number.isNaN(parseInt(totalResult.rows[0].total))
		? parseInt(totalResult.rows[0].total)
		: 0;

	const hasPrevious = page > 1;
	const hasNext = offset + size < t;
	const last = Math.max(Math.ceil(t / size), 1);
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
