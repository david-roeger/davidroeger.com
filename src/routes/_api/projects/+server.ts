console.info('_api/projects: +server.ts');

import type { PorjectFrontMatter } from '$lib/types';
import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

type Project = {
	metadata: PorjectFrontMatter;
};

export const handler = async ({ url }: { url: URL }) => {
	console.info('_api/projects: +server.ts // GET // handler');

	const modules = import.meta.glob(
		'../../projects/content/*.{md,svx,svelte.md}'
	);
	console.log(modules);
	const projectPromises = [];
	const limit = Number(url.searchParams.get('limit') ?? Infinity);

	if (Number.isNaN(limit)) {
		throw error(400, 'limit is not valid');
	}

	for (const [, resolver] of Object.entries(
		modules as Record<string, () => Promise<Project>>
	)) {
		const promise = resolver().then((project) => {
			console.log(project.metadata);
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
	console.info('_api/projects: +server.ts // GET');
	return handler({ url });
};
