import type { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const nameSchema = z.string().min(1, { message: 'Name is required' });
export const emailSchema = z
	.string()
	.min(1, { message: 'E-Mail is required' })
	.email({ message: 'Invalid E-Mail' });
export const messageSchema = z
	.string()
	.min(1, { message: 'Message is required' });

export const contactFormSchema = z.object({
	name: nameSchema,
	email: emailSchema,
	message: messageSchema
});

export type ZodContactForm = typeof contactFormSchema;
export type ContactFormSchema = z.infer<ZodContactForm>;

export type ContactFormMessage = {
	type: 'orange' | 'green' | 'red' | 'blue';
	html: string;
};

export type ContactForm = Awaited<
	ReturnType<typeof superValidate<ZodContactForm, ContactFormMessage>>
>;

export const DEFAULT_CONTACT_FORM: ContactFormSchema = {
	name: '',
	email: '',
	message: ''
};

export const COLOR_CLASSES = {
	default: {
		background: 'bg-mauve-5',
		highlight: 'group-focus-within:bg-mauve-5'
	},
	red: {
		background: 'bg-red-5',
		highlight: 'group-focus-within:bg-red-5'
	},
	green: {
		background: 'bg-green-5',
		highlight: 'group-focus-within:bg-green-5'
	},
	orange: {
		background: 'bg-orange-5',
		highlight: 'group-focus-within:bg-orange-5'
	},
	blue: {
		background: 'bg-blue-5',
		highlight: 'group-focus-within:bg-blue-5'
	},
	purple: {
		background: 'bg-purple-5',
		highlight: 'group-focus-within:bg-purple-5'
	}
};

export type ColorClassesKey = keyof typeof COLOR_CLASSES;
