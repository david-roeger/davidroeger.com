logger.page('_api/emojiData: +server.ts');
// ----------------------------------------------------------------

import { error, json } from '@sveltejs/kit';

import type { EmojiData } from '$components/EmojiPicker/types';

import { logger } from '$utils';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	logger.page('_api/emojiData: +server.ts // GET');
	// ----------------------------------------------------------------

	try {
		const response = await fetch(
			'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
		);
		if (response.ok) {
			const emojiData = (await response.json()) as EmojiData;
			return json(emojiData);
		}
		throw error(500);
	} catch (e) {
		logger.error(e);
		throw error(500);
	}
};

export const prerender = true;
