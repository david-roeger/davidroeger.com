logger.page('_api/experimental: +server.ts');
// ----------------------------------------------------------------

import { error, json } from '@sveltejs/kit';

import { logger } from '$utils/logger';

import type { RequestHandler } from './$types';

export const _handler = async ({ url }: { url: URL }) => {
	logger.page('_api/experimental: +server.ts // GET // handler');
	// ----------------------------------------------------------------

	const nested = import.meta.glob('../../experimental/*/+page.svelte');
	const limit = Number(url.searchParams.get('limit') ?? Infinity);

	if (Number.isNaN(limit)) {
		throw error(400, 'limit is not valid');
	}

	const projects = [];

	for (const [path] of Object.entries(nested)) {
		const slug =
			path.match(/\.\.\/\.\.\/experimental\/(.*?)\//i)?.[1] ?? undefined;
		if (!slug) {
			continue;
		}

		projects.push({ slug });
	}

	projects.sort((a, b) => a.slug.localeCompare(b.slug));

	return json(projects.slice(0, limit));
};

export const GET: RequestHandler = async ({ url }) => {
	logger.page('_api/experimental: +server.ts // GET');
	// ----------------------------------------------------------------

	return _handler({ url });
};
