console.info('_api/emojiData: +server.ts');

import type { EmojiData } from '$components/EmojiPicker/types';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	console.info('_api/emojiData: +server.ts // GET');

	try {
		const response = await fetch(
			'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
		);
		if (response.ok) {
			const emojiData = (await response.json()) as EmojiData;
			return json(emojiData);
		}
		throw error(500);
	} catch (err) {
		throw error(500);
	}
};
