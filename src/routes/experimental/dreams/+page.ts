console.info('experimental/dreams: +page.ts');

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, data }) => {
	console.info('experimental/dreams: +page.ts // load');

	const { dreams } = data;
	console.log(dreams);
	// const { dreams = [], error: err, status } = await getDreams(supabaseClient);
	// if (err) {
	// 	throw error(status ?? 500, err.message);
	// }

	const dreamsWithoutEmoji = dreams.filter(
		(dream) => !dream.emoji || dream.emoji === ''
	);

	if (dreamsWithoutEmoji.length === 0) {
		return {
			dreams,
			emojiMap: {}
		};
	}

	const res: Response = await fetch(
		`/_api/emojis.json?limit=${dreamsWithoutEmoji.length}`
	);

	if (res.ok) {
		const emojis = await res.json();
		console.log(emojis);
		const emojiMap: Record<string, string> = {};
		dreamsWithoutEmoji.forEach((dream, index) => {
			emojiMap[dream.id] = emojis[index];
		});
		return {
			dreams,
			emojiMap
		};
	}

	throw error(404, 'No Emojis found');
};
