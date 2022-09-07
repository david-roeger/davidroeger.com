import type { EmojiData } from '$components/EmojiPicker/types';
import type { GetReturnType } from '$lib/types';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get(): GetReturnType {
	console.log('get');
	try {
		const response = await fetch(
			'https://cdn.jsdelivr.net/npm/@emoji-mart/data',
		);
		if (response.ok) {
			const emojiData = await response.json();
			return {
				status: 200,
				body: emojiData as EmojiData,
			};
		}
		return {
			status: 400,
		};
	} catch (error) {
		return {
			status: 500,
		};
	}
}
