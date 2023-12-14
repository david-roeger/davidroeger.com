logger.page('index: +layout.server.ts');
// ----------------------------------------------------------------

import { superValidate } from 'sveltekit-superforms/server';

import { addDreamFormSchema } from '$slices/AddDreamForm/constants';
import { contactFormSchema } from '$slices/ContactForm/constants';

import { logger } from '$utils/logger';

import { editDreamFormSchema } from '$slices/EditDreamForm/constants';
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

	const editDreamForm = await superValidate(editDreamFormSchema, {
		id: 'editDreamForm'
	});

	return { contactForm, addDreamForm, editDreamForm };
};
