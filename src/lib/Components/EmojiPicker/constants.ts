export const EMOJI_KEYS = {
	all: () => ['emoji'],
	data: () => [...EMOJI_KEYS.all(), 'data'],
	index: () => [...EMOJI_KEYS.all(), 'index'],
	search: (s: string) => [...EMOJI_KEYS.index(), s]
};

export const EMOJI_FUSE_KEYS = [
	{ name: 'id', weight: 2 },
	{ name: 'name', weight: 1 },
	{ name: 'keywords', weight: 1 }
];
