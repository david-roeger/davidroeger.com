console.info('projects/(ssr): +page.server.ts');

import type { ProjectMetaData } from '$lib/types';

import { _handler as experimentalHandler } from '$routes/_api/_cachable/experimental/+server';
import { _handler as projectHandler } from '$routes/_api/_cachable/projects/+server';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	console.info('projects/(ssr): +page.server.ts // load');

	const projectUrl = new URL('./_api/_cachable/projects', url.href);
	const projectResponse = await projectHandler({ url: projectUrl });

	if (projectResponse.ok) {
		const projects = (await projectResponse.json()) ?? [];

		const experimentalUrl = new URL(
			'./_api/_cachable/experimental',
			url.href
		);
		const experimentalResponse = await experimentalHandler({
			url: experimentalUrl
		});

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
