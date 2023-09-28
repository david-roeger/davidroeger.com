logger.page('contact: +page.server.ts');
// ----------------------------------------------------------------

import { fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';

import { env } from '$env/dynamic/private';

import {
	contactFormSchema,
	type ZodContactForm,
	type ContactFormMessage,
	DEFAULT_CONTACT_FORM
} from '$slices/ContactForm/constants';

import { logger } from '$utils/logger';

import type { Actions } from './$types';

// TODO: this needs to be manually typed for now
// At least I think so
// https://github.com/sveltejs/kit/issues/7004
export const actions: Actions = {
	default: async ({ fetch, request, url: pageUrl }) => {
		logger.page('contact: +page.server.ts // Action // default');
		// ----------------------------------------------------------------

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

		logger.page(request.url);
		try {
			const meResponse = await fetch(
				`/_api/mail/me?secret=${env.MAIL_SECRET}`,
				{
					method: 'POST',
					body: JSON.stringify({ ...contactForm.data, url: pageUrl })
				}
			);

			const summaryResponse = await fetch(
				`/_api/mail/summary?secret=${env.MAIL_SECRET}`,
				{
					method: 'POST',
					body: JSON.stringify(contactForm.data)
				}
			);

			if (meResponse.ok) {
				const { name, email } = contactForm.data;

				contactForm.data = DEFAULT_CONTACT_FORM;
				if (summaryResponse.ok) {
					return message(contactForm, {
						type: 'green',
						html: `<h3>Thanks for your message ${name}!</h3><p class="text-xs">An auto-reply has been sent to <b><em>${email}</em></b></p>`
					});
				}

				return message(contactForm, {
					type: 'orange',
					html: `<h3>Thanks for your message ${name}!</h3><p class="text-xs">An auto-reply has been sent to <b><em>${email}</em></b>, but could not be delivered. Please check if the entered E-Mail address is correct</p>`
				});
			}
		} catch (e) {
			logger.error(e);
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
