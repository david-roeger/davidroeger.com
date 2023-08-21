logger.page('_prerender: +page.ts');
// ----------------------------------------------------------------

import { error } from '@sveltejs/kit';

import type { ProjectMetaData } from '$types';

import { logger } from '$utils/logger';

import { _handler } from '$routes/_api/projects/+server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	logger.page('_prerender: +page.ts // load');
	// ----------------------------------------------------------------

	const projectUrl = new URL('/_api/projects', url.href);
	const projectResponse = await _handler({ url: projectUrl });

	if (projectResponse.ok) {
		const projects = (await projectResponse.json()) ?? [];
		const projectLinks: string[] = [];
		for (const project of projects as ProjectMetaData[]) {
			projectLinks.push(`/projects/${project.slug}`);
			for (let i = 0; i < project.media.length + 2; i++) {
				projectLinks.push(`/projects/${project.slug}/${i}`);
			}
		}
		return {
			projectLinks
		};
	}

	throw error(500, "Couldn't load projects for prerendering");
};
