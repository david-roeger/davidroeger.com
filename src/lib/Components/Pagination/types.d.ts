export type Pageable<T> = {
	total: number;
	current: number;
	size: number;
	rows: T[];
	hasPrevious: boolean;
	hasNext: boolean;
	previous: number;
	next: number;
	last: number;
};
