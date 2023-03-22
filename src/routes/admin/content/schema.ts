import { z } from 'zod';

export const schema = z.object({
	draft: z.boolean().default(false),
	slug: z.string().min(1),
	order: z.number().min(0),
	title: z.string().min(1),
	meta: z.string().optional(),
	description: z.string().min(1),
	date: z.string().datetime().min(1),
	tags: z.array(z.string().min(1)),
	team: z.array(z.string().min(1)),
	org: z.string().optional(),
	github: z.string().optional(),
	link: z.string().optional(),
	vertical: z.string().min(1),
	horizontal: z.string().min(1),
	media: z.array(z.string().min(1)),
	lastmod: z.string().min(1).datetime(),
	keywords: z.array(z.string().min(1)),
	content: z.string().min(1)
});

export type FrontMatter = Omit<z.infer<typeof schema>, 'content'>;
export type FrontMatterWithoutLastmod = Omit<FrontMatter, 'lastmod'>;
export type Content = Pick<z.infer<typeof schema>, 'content'>;
