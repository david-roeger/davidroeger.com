import type { GetReturnType } from '$lib/types';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }: { url: URL }): GetReturnType {
	const nested = import.meta.glob('./*/index.svelte');
	const projectPromises: Promise<{
		slug: string;
		thumbnail: string;
	}>[] = [];
	const limit = Number(url.searchParams.get('limit') ?? Infinity);

	if (Number.isNaN(limit)) {
		return {
			status: 400,
		};
	}

	for (const [path, resolver] of Object.entries(nested)) {
		const slug = path.match(/\.\/(.*?)\//i)?.[1] ?? null;

		if (!slug || slug === 'template') {
			continue;
		}
		const promise = resolver().then(({ thumbnail }) => {
			return { slug, thumbnail };
		});
		projectPromises.push(promise);
	}

	const projects = await Promise.all(projectPromises);

	projects.sort((a, b) => a.slug.localeCompare(b.slug));

	return {
		status: 200,
		body: projects.slice(0, limit),
	};
}
