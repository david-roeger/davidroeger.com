console.info('experimental/dreams: +page.ts');

import supabaseClient from '$utils/Dreams/subabaseClient';
import { getDreams } from '$utils/Dreams/supabaseRequest';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	console.info('experimental/dreams: +page.ts //  load');

	const { dreams = [], error: err, status } = await getDreams(supabaseClient);
	if (err) {
		throw error(status ?? 500, err.message);
	}

	const dreamsWithoutEmoji = dreams.filter((dream) => !dream.emoji);

	if (dreamsWithoutEmoji.length === 0) {
		return {
			dreams
		};
	}

	const res: Response = await fetch(
		`/experimental/dreams/emojis.json?limit=${dreamsWithoutEmoji.length}`
	);

	if (res.ok) {
		const emojis = await res.json();
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

export const prerender = false;
