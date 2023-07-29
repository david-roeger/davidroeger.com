export const DREAMS_KEYS = {
	all: () => ['dreams'],
	size: (size: number) => [...DREAMS_KEYS.all(), size],
	page: (size: number, page: number) => [...DREAMS_KEYS.size(size), page]
};

export const DREAMS_DEFAULT_PAGE = 1;
export const DREAMS_DEFAULT_SIZE = 10;
