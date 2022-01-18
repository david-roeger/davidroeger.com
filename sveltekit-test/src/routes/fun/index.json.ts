import { slugFromPath } from '$lib/Utils';
import type { GetReturnType } from '$lib/types';

/** @type {import('@sveltejs/kit').RequestHandler} */

export async function get({ url }: { url: URL }): GetReturnType {
	const modules = import.meta.glob('./*.svelte');
	console.log(modules);
	console.log('hallo');
	const projectPromises: Promise<{
		slug: string;
		thumbnail: string;
	}>[] = [];
	const limit = Number(url.searchParams.get('limit') ?? Infinity);

	if (Number.isNaN(limit)) {
		return {
			status: 400
		};
	}
	for (const [path, resolver] of Object.entries(modules)) {
		console.log(path);
		const slug = slugFromPath(path);
		const promise = resolver().then(({ thumbnail }) => {
			return { slug, thumbnail };
		});
		projectPromises.push(promise);
	}

	const projects = await Promise.all(projectPromises);

	projects.sort((a, b) => a.slug.localeCompare(b.slug));

	return {
		status: 200,
		body: projects.slice(0, limit)
	};
}
