//import { slugFromPath } from '$lib/util';
import type { GetReturnType } from '$lib/types';

/** @type {import('@sveltejs/kit').RequestHandler} */

export async function get({
	params,
}: {
	params: { slug: string };
}): GetReturnType {
	const modules = import.meta.glob(`./markdown/*.{md,svx,svelte.md}`);
	const { slug } = params;
	for (const [path, resolver] of Object.entries(modules)) {
		if (path === slug) {
			const project = await resolver();
			return {
				status: 200,
				body: { ...project.metadata, slug },
			};
		}
	}

	return {
		status: 404,
	};
}
