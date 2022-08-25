import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const nested = import.meta.glob('../../experimental/*/+page.svelte');
	const limit = Number(url.searchParams.get('limit') ?? Infinity);

	if (Number.isNaN(limit)) {
		throw error(400, 'limit is not valid');
	}

	const projects = [];

	for (const [path] of Object.entries(nested)) {
		const slug = path.match(/\.\.\/\.\.\/experimental\/(.*?)\//i)?.[1] ?? undefined;
		if (!slug || slug === 'template') {
			continue;
		}

		projects.push({ slug });
	}

	projects.sort((a, b) => a.slug.localeCompare(b.slug));

	return json(projects.slice(0, limit));
};
