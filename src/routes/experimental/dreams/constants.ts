export const DREAMS_KEYS = {
	all: () => ['dreams'],
	list: () => [...DREAMS_KEYS.all(), 'list'],
	size: (size: number) => [...DREAMS_KEYS.list(), size],
	page: (size: number, page: number) => [...DREAMS_KEYS.size(size), page],
	id: (id: string) => [...DREAMS_KEYS.all(), id]
};

export const DREAMS_DEFAULT_PAGE = 1;
export const DREAMS_DEFAULT_SIZE = 10;
