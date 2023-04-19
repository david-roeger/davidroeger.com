console.info('about: +server.ts');

import { error } from '@sveltejs/kit';

import type { Resume } from '$lib/resume';
import { _handler } from '$routes/_api/resume/+server';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	console.info('about: +server.ts // load');

	const resumeResponse = await _handler();
	if (!resumeResponse.ok) {
		throw error(500, "Couldn't load resume");
	}

	const resume = await resumeResponse.json();
	return resume as Resume;
};
