import { slugFromPath } from '$lib/Utils';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	console.log('GET');
	const modules = import.meta.glob(`../content/*.{md,svx,svelte.md}`);
	const { slug } = params;

	console.log(modules);

	for (const [path, resolver] of Object.entries(modules)) {
		const computedSlug = slugFromPath(path);

		if (slug === computedSlug) {
			const project = await resolver();
			const { html } = project.default.render();
			const { published, ...metadata } = project.metadata;

			if (published) {
				return json({ ...metadata, published, html, slug });
			}

			throw error(404, `Project ${slug} not found`);
		}
	}

	throw error(404, `Project ${slug} not found`);
};
