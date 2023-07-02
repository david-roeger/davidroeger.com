console.info('about: +page.ts');

import { error } from '@sveltejs/kit';

import type { Resume } from '$lib/resume';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	console.info('about: +page.ts // load');

	const resumeResponse = await fetch('/_api/resume');
	if (!resumeResponse.ok) {
		throw error(500, "Couldn't load resume");
	}

	const resume = (await resumeResponse.json()) as Resume;
	return { resume };
};
