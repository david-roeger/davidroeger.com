import type { GetReturnType } from '$lib/types';
import { getRandomEmojis } from '$lib/Utils';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }: { url: URL }): GetReturnType {
	console.log(url);
	const limit = Number(url.searchParams.get('limit') ?? 10);

	if (Number.isNaN(limit)) {
		return {
			status: 400,
		};
	}

	const emojis = getRandomEmojis(limit);

	return {
		status: 200,
		body: emojis,
	};
}
