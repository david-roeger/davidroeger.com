console.info('projects/[slug]: +page.ts');

import type { ProjectMetaData } from '$lib/types';
import { handler } from '$routes/_api/projects/[slug]/+server';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	console.info('projects/[slug]: +page.ts // load');
	const { slug } = params;
	console.info(`projects/[slug]: +page.ts // load (${slug})`);

	const res = await handler({ params });
	if (res.ok) {
		const project = await res.json();
		return project as ProjectMetaData;
	}

	throw error(404, `Project not found: ${slug}`);
};
