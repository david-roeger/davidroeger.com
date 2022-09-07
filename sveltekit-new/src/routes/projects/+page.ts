console.info('projects: +page.ts');

import type { ProjectMetaData } from '$lib/types';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	console.info('projects: +page.ts // load');

	const projectResponse = await fetch('./_api/projects');
	if (projectResponse.ok) {
		const projects = (await projectResponse.json()) ?? [];
		const experimentalResponse = await fetch('./_api/experimental');
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
