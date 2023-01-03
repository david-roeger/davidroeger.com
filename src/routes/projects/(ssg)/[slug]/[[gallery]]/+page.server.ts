console.info('projects/[slug]/[[gallery]]: +page.ts');

import type { ProjectMetaData } from '$lib/types';
import { handler } from '$routes/_api/projects/[slug]/+server';
import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	console.info('projects/[slug]/[[gallery]]: +page.ts // load');
	const { slug, gallery } = params;
	console.info(
		`projects/[slug]/[[gallery]]: +page.ts // load (${slug} / ${gallery})`
	);

	const res = await handler({ params });
	if (res.ok) {
		const project = (await res.json()) as ProjectMetaData;
		console.info(
			`projects/[slug]/[[gallery]]: +page.ts // load (${slug} / ${gallery}) // project:`,
			project
		);
		const media = project.media.length - 1 + 2; // add 2 for the vertical and horizontal images
		if (gallery !== undefined) {
			const index = parseInt(gallery);
			if (isNaN(index) || index < 0 || index > media) {
				throw redirect(303, `/projects/${slug}`);
			}
		}
		return { project, gallery };
	}

	throw error(404, `Project not found: ${slug}`);
};
