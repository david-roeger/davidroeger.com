//import { slugFromPath } from '$lib/util';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {
	const modules = import.meta.glob(`./*.{md,svx,svelte.md}`);
	const { slug } = params;
	for (const [path, resolver] of Object.entries(modules)) {
		if (path === slug) {
			const project = await resolver();
			return {
				status: 200,
				body: project.metadata
			};
		}
	}

	console.log('Not Found');
	return {
		status: 404
	};
}
