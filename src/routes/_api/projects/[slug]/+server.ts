console.info('_api/projects/[slug]: +server.ts');

import { slugFromPath } from '$lib/Utils';
import { error, json } from '@sveltejs/kit';

import type { RequestEvent, RequestHandler } from './$types';

export type RouteParams = RequestEvent['params'];

type ProjectEntry = {
	default: { render: () => { html: string } };
	metadata: { published: boolean };
};

export const handler = async ({ params }: { params: RouteParams }) => {
	console.info('_api/projects/[slug]: +server.ts // GET // handler');

	const modules = import.meta.glob(
		`../../../projects/content/*.{md,svx,svelte.md}`
	);
	const { slug } = params;

	console.info(
		`_api/projects/[slug]: +server.ts // GET // handler (${slug})`
	);

	for (const [path, resolver] of Object.entries(
		modules as Record<string, () => Promise<ProjectEntry>>
	)) {
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

export const GET: RequestHandler = async ({ params }) => {
	console.info('_api/projects/[slug]: +server.ts // GET');
	return handler({ params });
};
