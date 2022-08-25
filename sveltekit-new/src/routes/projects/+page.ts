import type { ProjectMetaData } from '$lib/types';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	console.info('projects Page: script module call');

	const res = await fetch('./_api/projects');
	if (res.ok) {
		const projects = await res.json();
		return { projects: projects as ProjectMetaData[] };
	}

	throw error(500, "Couldn't load projects");
};
