logger.page('index: +layout.server.ts');
// ----------------------------------------------------------------

import { superValidate } from 'sveltekit-superforms/server';

import { contactFormSchema } from '$slices/ContactForm/constants';
import { addDreamFormSchema } from '$slices/AddDreamForm/constants';

import { logger } from '$utils';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	logger.page('index: +layout.server.ts // load');
	// ----------------------------------------------------------------

	const contactForm = await superValidate(contactFormSchema, {
		id: 'contactForm'
	});

	const addDreamForm = await superValidate(addDreamFormSchema, {
		id: 'addDreamForm'
	});

	return { contactForm, addDreamForm };
};
