logger.page('projects/(ssg)/[slug]/[[gallery]]: +page.server.ts');
// ----------------------------------------------------------------

import { error, redirect } from '@sveltejs/kit';

import { logger } from '$utils';

import type { ProjectMetaData } from '$types';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	logger.page('projects/(ssg)/[slug]/[[gallery]]: +page.server.ts // load');
	// ----------------------------------------------------------------

	const { slug, gallery } = params;
	logger.page(
		`projects/(ssg)/[slug]/[[gallery]]: +page.server.ts // load (${slug} / ${gallery})`
	);

	const res = await fetch(`/_api/projects/${slug}`);
	if (res.ok) {
		const project = (await res.json()) as ProjectMetaData;
		const media = project.media.length - 1 + 2; // add 2 for the vertical and horizontal images
		if (gallery !== undefined) {
			const index = parseInt(gallery);
			if (isNaN(index) || index < 0 || index > media) {
				throw redirect(303, `/projects/${slug}`);
			}
			return { project, gallery: index };
		}
		return { project };
	}
	throw error(404, `Project not found: ${slug} / ${gallery}`);
};
