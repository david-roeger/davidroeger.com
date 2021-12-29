import { slugFromPath } from '$lib/Utils';
import type { GetReturnType } from '$lib/types';

/** @type {import('@sveltejs/kit').RequestHandler} */

export async function get({ query }: { query: URLSearchParams }): GetReturnType {
	const modules = import.meta.glob('./*.{md,svx,svelte.md}');

	const projectPromises = [];
	const limit = Number(query.get('limit') ?? Infinity);

	if (Number.isNaN(limit)) {
		return {
			status: 400
		};
	}
	//slugFromPath(path)
	for (const [path, resolver] of Object.entries(modules)) {
		const slug = slugFromPath(path);

		const promise = resolver().then((post) => ({
			slug,
			...post.metadata
		}));

		projectPromises.push(promise);
	}

	const projects = await Promise.all(projectPromises);
	const publishedProjects = projects.filter((project) => project.published);

	publishedProjects.sort((a, b) => a.order - b.order);

	return {
		status: 200,
		body: publishedProjects.slice(0, limit)
	};
}
