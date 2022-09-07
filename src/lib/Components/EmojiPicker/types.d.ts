import type { Writable } from 'svelte/store';

export interface RootContext {
	id: string;
	name: string;
	required: boolean;
	activeValue: Writable<string>;
}

interface EmojiCategory {
	id: string;
	emojis: string[];
}

interface EmojValue {
	id: string;
	name: string;
	keywords: string[];
	skins: { unified: string; native: string }[];
	version: number;
}

export interface EmojiData {
	categories: EmojiCategory[];
	emojis: {
		[key: string]: EmojiValue;
	};
	aliases: {
		[key: string]: string;
	};
	sheet: { cols: number; rows: number };
}

export interface Emoji {
	id: string;
	name: string;
	native: string;
	unified: string;
	keywords: string[];
	shortcodes: string;
}
