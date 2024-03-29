logger.page('projects/(ssr): +page.server.ts');
// ----------------------------------------------------------------

import type { ProjectMetaData } from '$types';

import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { logger } from '$utils/logger';

export const load: PageServerLoad = async ({ fetch }) => {
	logger.page('projects/(ssr): +page.server.ts // load');
	// ----------------------------------------------------------------

	const projectResponse = await fetch('/_api/projects');

	if (projectResponse.ok) {
		const projects = (await projectResponse.json()) ?? [];

		const experimentalResponse = await fetch('/_api/experimental');

		let experimental = [];
		if (experimentalResponse.ok) {
			experimental = (await experimentalResponse.json()) ?? [];
		}
		return {
			projects: projects as ProjectMetaData[],
			experimental: experimental as { slug: string; thumbnail?: string }[]
		};
	}

	throw error(500, "Couldn't load projects");
};
