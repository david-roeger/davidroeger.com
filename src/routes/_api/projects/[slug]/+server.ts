console.info('_api/projects/[slug]: +server.ts');

import type { PorjectFrontMatter } from '$lib/types';
import { error, json } from '@sveltejs/kit';

import type { RequestEvent, RequestHandler } from './$types';

export type RouteParams = RequestEvent['params'];

type ProjectEntry = {
	default: { render: () => { html: string } };
	metadata: PorjectFrontMatter;
};

export const handler = async ({ params }: { params: RouteParams }) => {
	console.info('_api/projects/[slug]: +server.ts // GET // handler');

	const modules = import.meta.glob(
		`../../../projects/content/*.{md,svx,svelte.md}`
	);
	const { slug: urlSlug } = params;

	console.info(
		`_api/projects/[slug]: +server.ts // GET // handler (${urlSlug})`
	);

	for (const [, resolver] of Object.entries(
		modules as Record<string, () => Promise<ProjectEntry>>
	)) {
		const project = await resolver();
		const { slug: projectSlug } = project.metadata;
		if (urlSlug && projectSlug && urlSlug === projectSlug) {
			const { html } = project.default.render();
			const { published, ...metadata } = project.metadata;

			if (published) {
				return json({ ...metadata, published, html });
			}
		}
	}

	throw error(404, `Project ${urlSlug} not found`);
};

export const GET: RequestHandler = async ({ params }) => {
	console.info('_api/projects/[slug]: +server.ts // GET');
	return handler({ params });
};
