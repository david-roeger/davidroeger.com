//import { slugFromPath } from '$lib/util';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {
	console.log(params);
	const modules = import.meta.glob(`./*.{md,svx,svelte.md}`);
	console.log(modules);
	let match;
	for (const [path, resolver] of Object.entries(modules)) {
		console.log(path);
		if (path === params.slug) {
			match = [path, resolver];
			break;
		}
	}

	if (!match) {
		return {
			status: 404
		};
	}

	const project = await match[1]();

	return {
		status: 200,
		body: project.metadata
	};
}
