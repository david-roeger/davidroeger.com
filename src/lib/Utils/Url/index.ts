import z from 'zod';

export const safeUrlParam = (url: URL, key: string) => {
	const value = url.searchParams.get(key);
	if (value === null) return undefined;
	return value;
};

export const ensureNumber = (d: number, min = 1) => {
	return z.coerce
		.number()
		.min(min)
		.transform((v) => v ?? d)
		.catch(d)
		.default(d);
};

export const parseNumber = ({
	url,
	key,
	defaultNumber,
	min = 1
}: {
	url: URL;
	key: string;
	defaultNumber: number;
	min?: number;
}) => {
	return ensureNumber(defaultNumber, min).parse(safeUrlParam(url, key));
};
