logger.page('_api/emoji/data.json: +server.ts');
// ----------------------------------------------------------------

import { error, json } from '@sveltejs/kit';

import type { EmojiData } from '$components/EmojiPicker/types';

import { logger } from '$utils/logger';

import type { RequestHandler } from './$types';
import data from './backupdata.json';

export const GET: RequestHandler = async () => {
	logger.page('_api/emoji/data.json: +server.ts // GET');
	// ----------------------------------------------------------------

	try {
		const response = await fetch(
			'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
		);
		if (response.ok) {
			const emojiData = (await response.json()) as EmojiData;
			return json(emojiData);
		}

		return json(data as EmojiData);
	} catch (e) {
		logger.error(e);
		return error(500);
	}
};

export const prerender = true;
