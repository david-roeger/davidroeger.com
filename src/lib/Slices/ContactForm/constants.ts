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
