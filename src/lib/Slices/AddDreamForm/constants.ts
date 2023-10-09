import type { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const userIdSchema = z
	.string()
	.min(1, { message: 'UserId is required' });

export const textSchema = z.string().min(3, { message: 'Text is required' });

export const emojiSchema = z
	.string()
	.min(1, { message: 'Emoji is required' })
	.default('❤️');

export const addDreamFormSchema = z.object({
	userId: userIdSchema,
	text: textSchema,
	emoji: emojiSchema
});

export type ZodAddDreamForm = typeof addDreamFormSchema;
export type AddDreamFormSchema = z.infer<ZodAddDreamForm>;

export type AddDreamFormMessage = {
	type: 'green' | 'red';
	html: string;
};

export type AddDreamForm = Awaited<
	ReturnType<typeof superValidate<ZodAddDreamForm, AddDreamFormMessage>>
>;

export const DEFAULT_ADD_DREAM_FORM: AddDreamFormSchema = {
	userId: '',
	text: '',
	emoji: '❤️'
};
