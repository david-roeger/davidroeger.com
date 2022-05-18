//import { slugFromPath } from '$lib/util';
import type { GetReturnType } from '$lib/types';
import { slugFromPath } from '$lib/Utils';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({
	params,
}: {
	params: { slug: string };
}): GetReturnType {
	const modules = import.meta.glob(`./content/*.{md,svx,svelte.md}`);
	const { slug } = params;

	for (const [path, resolver] of Object.entries(modules)) {
		const computedSlug = slugFromPath(path);

		if (slug === computedSlug) {
			const project = await resolver();
			const { html } = project.default.render();
			const { published, order, ...metadata } = project.metadata;

			if (published) {
				return {
					status: 200,
					body: { ...metadata, html, slug },
				};
			} else {
				return {
					status: 404,
				};
			}
		}
	}

	return {
		status: 404,
	};
}
