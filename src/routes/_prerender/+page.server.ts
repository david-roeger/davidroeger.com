console.info('_prerender: +page.ts');

import type { ProjectMetaData } from '$lib/types';
import { handler } from '$routes/_api/projects/+server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	console.info('_prerender: +page.ts // load');

	const projectUrl = new URL('./_api/projects', url.href);
	const projectResponse = await handler({ url: projectUrl });

	if (projectResponse.ok) {
		const projects = (await projectResponse.json()) ?? [];

		return {
			projects: projects as ProjectMetaData[]
		};
	}

	throw error(500, "Couldn't load projects for prerendering");
};
