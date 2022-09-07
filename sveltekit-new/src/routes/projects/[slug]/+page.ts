console.info('projects/[slug]: +page.ts');

import type { ProjectMetaData } from '$lib/types';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	console.info('projects/[slug]: +page.ts // load');
	const { slug } = params;
	console.info(`projects/[slug]: +page.ts // load (${slug})`);

	const res = await fetch(`../_api/projects/${slug}`);
	if (res.ok) {
		const project = await res.json();
		return project as ProjectMetaData;
	}

	throw error(404, `Project not found: ${slug}`);
};
