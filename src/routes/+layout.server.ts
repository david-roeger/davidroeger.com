import { superValidate } from 'sveltekit-superforms/server';
import { contactFormSchema } from '$lib/Slices/ContactForm/constants';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	console.info('contact: +page.server.ts // load');

	const contactForm = await superValidate(contactFormSchema, {
		id: 'contactForm'
	});

	return { contactForm };
};
