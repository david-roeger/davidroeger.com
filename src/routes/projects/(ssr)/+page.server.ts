console.info('projects/(ssr): +page.server.ts');

import type { ProjectMetaData } from '$lib/types';

import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	console.info('projects/(ssr): +page.server.ts // load');

	const projectResponse = await fetch('/_api/_cachable/projects');

	if (projectResponse.ok) {
		const projects = (await projectResponse.json()) ?? [];

		const experimentalResponse = await fetch(
			'/_api/_cachable/experimental'
		);

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
