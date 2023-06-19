console.info('about: +page.ts');

import { error } from '@sveltejs/kit';

import type { Resume } from '$lib/resume';
import type { PageLoad } from './$types';
import { _handler } from '$routes/_api/_cachable/resume/+server';

export const load: PageLoad = async () => {
	console.info('about: +page.ts // load');

	const resumeResponse = await _handler();
	if (!resumeResponse.ok) {
		throw error(500, "Couldn't load resume");
	}

	const resume = (await resumeResponse.json()) as Resume;
	return { resume };
};
