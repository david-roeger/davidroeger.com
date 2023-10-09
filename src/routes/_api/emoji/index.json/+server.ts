logger.page('_api/emoji/index.json: +server.ts');
// ----------------------------------------------------------------

import { error, json } from '@sveltejs/kit';

import Fuse from 'fuse.js';

import type { EmojiData } from '$components/EmojiPicker/types';

import { logger } from '$utils/logger';

import type { RequestHandler } from './$types';
import { EMOJI_FUSE_KEYS } from '$components/EmojiPicker/constants';

export const GET: RequestHandler = async ({ fetch }) => {
	logger.page('_api/emoji/index.json: +server.ts // GET');
	// ----------------------------------------------------------------

	try {
		const response = await fetch(`/_api/emoji/data.json`);

		if (response.ok) {
			const emojiData = (await response.json()) as EmojiData;
			const emojis = emojiData ? Object.values(emojiData.emojis) : [];
			const index = Fuse.createIndex(EMOJI_FUSE_KEYS, emojis);

			return json(index.toJSON());
		}

		throw error(500);
	} catch (e) {
		logger.error(e);
		throw error(500);
	}
};

export const prerender = true;
