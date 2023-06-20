console.info('_prerender: +page.ts');

import { error } from '@sveltejs/kit';

import type { ProjectMetaData } from '$lib/types';

import { _handler } from '$routes/_api/_cachable/projects/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	console.info('_prerender: +page.ts // load');

	const projectUrl = new URL('/_api/_cachable/projects', url.href);
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