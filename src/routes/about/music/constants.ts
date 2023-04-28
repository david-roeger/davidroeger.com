import { fromBase64 } from '$lib/Utils';
import { z } from 'zod';

export const tabSchema = z.enum(['tracks', 'artists']);
export type Tab = z.infer<typeof tabSchema>;
export const rangeSchema = z.enum(['short', 'medium', 'long']);
export type Range = z.infer<typeof rangeSchema>;

export const timeRanges: Record<
	Range,
	{
		value: Range;
		label: string;
	}
> = {
	short: {
		value: 'short',
		label: 'last 4 Weeks'
	},
	medium: {
		value: 'medium',
		label: 'last 6 Months'
	},
	long: {
		value: 'long',
		label: 'probably forever'
	}
};

export const sSchema = z.object({
	range: rangeSchema,
	tab: tabSchema
});
export type S = z.infer<typeof sSchema>;

export const defaultValue: S = {
	range: timeRanges.medium.value,
	tab: 'tracks'
};

export const createStateFromParam = (value: string | null): S => {
	if (!value) return defaultValue;
	const decoded = decodeURIComponent(value);
	const json = fromBase64(decoded);
	if (!json) return defaultValue;
	const parsed = JSON.parse(json);
	if (!parsed) return defaultValue;
	const s = sSchema.safeParse(parsed);
	if (!s.success) return defaultValue;
	return s.data;
};
