console.info('_api/projects: +server.ts');

import { slugFromPath } from '$lib/Utils';
import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	console.info('_api/projects: +server.ts // GET');

	const modules = import.meta.glob(
		'../../projects/content/*.{md,svx,svelte.md}'
	);
	const projectPromises = [];
	const limit = Number(url.searchParams.get('limit') ?? Infinity);

	if (Number.isNaN(limit)) {
		throw error(400, 'limit is not valid');
	}

	for (const [path, resolver] of Object.entries(modules)) {
		const slug = slugFromPath(path);
		const promise = resolver().then((project) => ({
			slug,
			...project.metadata
		}));

		projectPromises.push(promise);
	}

	const projects = await Promise.all(projectPromises);
	const publishedProjects = projects.filter((project) => project.published);

	publishedProjects.sort((a, b) => a.order - b.order);

	return json(publishedProjects.slice(0, limit));
};
