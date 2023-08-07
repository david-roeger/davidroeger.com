import z from 'zod';

export const safeUrlParam = (url: URL, key: string) => {
	const value = url.searchParams.get(key);
	if (value === null) return undefined;
	return value;
};

export const ensurePositiveInteger = (d: number) => {
	return z.coerce
		.number()
		.min(1)
		.transform((v) => v ?? d)
		.catch(d)
		.default(d);
};
