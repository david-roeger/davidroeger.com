console.info('contact: +page.server.ts');

import { z } from 'zod';

import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { MAIL_SECRET } from '$env/static/private';

import {
	contactFormSchema,
	type ZodContactForm,
	type ContactFormMessage,
	DEFAULT_CONTACT_FORM
} from '$lib/Slices/ContactForm/constants';
import { message, superValidate } from 'sveltekit-superforms/server';

// TODO: this needs to be manually typed for now
// At least I think so
// https://github.com/sveltejs/kit/issues/7004
export const actions: Actions = {
	default: async ({ fetch, request, url: pageUrl }) => {
		console.info('contact: +page.server.ts // Action // default');

		const contactForm = await superValidate<
			ZodContactForm,
			ContactFormMessage
		>(request, contactFormSchema, {
			id: 'contactForm'
		});

		// Convenient validation check:
		if (!contactForm.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { contactForm });
		}

		console.info(request.url);
		try {
			const meResponse = await fetch(
				`/_api/mail/me?secret=${MAIL_SECRET}`,
				{
					method: 'POST',
					body: JSON.stringify({ ...contactForm.data, url: pageUrl })
				}
			);

			const summaryResponse = await fetch(
				`/_api/mail/summary?secret=${MAIL_SECRET}`,
				{
					method: 'POST',
					body: JSON.stringify(contactForm.data)
				}
			);

			if (meResponse.ok) {
				contactForm.data = DEFAULT_CONTACT_FORM;
				if (summaryResponse.ok) {
					return message(contactForm, {
						type: 'green',
						html: `<h3>Thanks for your message ${contactForm.data.name}!</h3><p class="text-xs">An auto-reply has been sent to <b><em>${contactForm.data.email}</em></b></p>`
					});
				}

				return message(contactForm, {
					type: 'orange',
					html: `<h3>Thanks for your message ${contactForm.data.name}!</h3><p class="text-xs">An auto-reply has been sent to <b><em>${contactForm.data.email}</em></b>, but could not be delivered. Please check if the entered E-Mail address is correct</p>`
				});
			}
		} catch (error) {
			console.error(error);
		}

		return message(
			contactForm,
			{
				type: 'red',
				html: '<h3>An unkown error occurred while sending your message. Please try again later</h3>'
			},
			{
				status: 500
			}
		);
	}
};

export const prerender = false;
