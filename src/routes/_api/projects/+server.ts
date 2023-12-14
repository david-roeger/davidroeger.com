logger.page('_api/projects: +server.ts');
// ----------------------------------------------------------------

import { error, json } from '@sveltejs/kit';

import type { ProjectFrontMatter } from '$types';

import { logger } from '$utils/logger';

import type { RequestHandler } from './$types';

type Project = {
	metadata: ProjectFrontMatter;
};

export const _handler = async ({ url }: { url: URL }) => {
	logger.page('_api/projects: +server.ts // GET // handler');
	// ----------------------------------------------------------------

	const modules = import.meta.glob(
		'../../projects/content/*.{md,svx,svelte.md}'
	);
	const projectPromises = [];
	const limit = Number(url.searchParams.get('limit') ?? Infinity);

	if (Number.isNaN(limit)) {
		error(400, 'limit is not valid');
	}

	for (const [, resolver] of Object.entries(
		modules as Record<string, () => Promise<Project>>
	)) {
		const promise = resolver().then((project) => {
			return project.metadata;
		});

		projectPromises.push(promise);
	}

	const projects = await Promise.all(projectPromises);
	const publishedProjects = projects.filter((project) => project.published);

	publishedProjects.sort((a, b) => a.order - b.order);

	return json(publishedProjects.slice(0, limit));
};

export const GET: RequestHandler = async ({ url }) => {
	logger.page('_api/projects: +server.ts // GET');
	// ----------------------------------------------------------------

	return _handler({ url });
};
