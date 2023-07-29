import { superValidate } from 'sveltekit-superforms/server';
import { contactFormSchema } from '$lib/Slices/ContactForm/constants';
import type { LayoutServerLoad } from './$types';
import { addDreamFormSchema } from '$lib/Slices/AddDreamForm/constants';

export const load: LayoutServerLoad = async () => {
	console.info('contact: +page.server.ts // load');

	const contactForm = await superValidate(contactFormSchema, {
		id: 'contactForm'
	});

	const addDreamForm = await superValidate(addDreamFormSchema, {
		id: 'addDreamForm'
	});

	return { contactForm, addDreamForm };
};
