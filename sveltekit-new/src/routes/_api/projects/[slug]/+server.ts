console.info('_api/projects/[slug]: +server.ts');

import { slugFromPath } from '$lib/Utils';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	console.info('_api/projects/[slug]: +server.ts // GET');

	const modules = import.meta.glob(
		`../../../projects/content/*.{md,svx,svelte.md}`
	);
	const { slug } = params;

	console.info(`_api/projects/[slug]: +server.ts // GET (${slug})`);

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