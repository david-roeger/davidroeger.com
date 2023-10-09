logger.page('_api/dreams/id: +server.ts');
// ----------------------------------------------------------------

import { error, json } from '@sveltejs/kit';

import client from '$utils/Db/client';

import type { RequestHandler } from './$types';
import type { Dream } from '$types';
import { logger } from '$utils/logger';

export const GET: RequestHandler = async ({ url, params, locals }) => {
	logger.page('_api/dreams/id: +server.ts // GET');

	const session = await locals.auth.validate();
	if (!session) throw error(401, 'Unauthorized');

	const id = params.id;
	logger.page(`_api/dreams/[id]: +server.ts // GET // id: ${id}`);

	const dreamResult = await client.query(
		'SELECT * from dreams WHERE id = $1 AND created_by = $2 LIMIT 1',
		[id, session.user.userId]
	);

	const dream = dreamResult.rows[0];

	if (!dream) throw error(404);

	return json(dream as Dream);
};
