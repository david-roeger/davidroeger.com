import type { ProjectMetaData } from '$lib/types';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

import { browser, dev } from '$app/env';

export const load: PageLoad = async ({ fetch, params }) => {
	const { slug } = params;
	console.info(`projects/slug (${slug}) Page: load call`);

	console.log(`fetching: ../_api/projects/${slug}`);
	const res = await fetch(`../_api/projects/${slug}`);
	console.log(res.ok);
	if (res.ok) {
		const project = await res.json();
		console.log(project);
		return project as ProjectMetaData;
	}

	throw error(404, `Project not found: ${slug}`);
};

export const router = browser;
export const prerender = dev;
