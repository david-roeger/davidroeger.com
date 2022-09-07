import type { EmojiData } from '$components/EmojiPicker/types';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');
		if (response.ok) {
			const emojiData = (await response.json()) as EmojiData;
			return json(emojiData);
		}
		throw error(500);
	} catch (err) {
		throw error(500);
	}
};
