import type { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const userIdSchema = z
	.string()
	.min(1, { message: 'UserId is required' });

export const dreamIdSchema = z
	.string()
	.min(1, { message: 'DreamId is required' });

export const textSchema = z.string().min(3, { message: 'Text is required' });

export const emojiSchema = z
	.string()
	.min(1, { message: 'Emoji is required' })
	.default('❤️');

export const editDreamFormSchema = z.object({
	userId: userIdSchema,
	dreamId: dreamIdSchema,
	text: textSchema,
	emoji: emojiSchema
});

export type ZodEditDreamForm = typeof editDreamFormSchema;
export type EditDreamFormSchema = z.infer<ZodEditDreamForm>;

export type EditDreamFormMessage = {
	type: 'green' | 'red';
	html: string;
};

export type EditDreamForm = Awaited<
	ReturnType<typeof superValidate<ZodEditDreamForm, EditDreamFormMessage>>
>;

export const DEFAULT_EDIT_DREAM_FORM: EditDreamFormSchema = {
	userId: '',
	dreamId: '',
	text: '',
	emoji: '❤️'
};
