console.info('contact: +page.server.ts');

import { z } from 'zod';

import { invalid, type ValidationError } from '@sveltejs/kit';
import type { Actions, ActionData } from './$types';
import { MAIL_SECRET } from '$env/static/private';

export type ContactFormActionData = ActionData;

// TODO: this needs to be manually typed for now
// At least I think so
// https://github.com/sveltejs/kit/issues/7004
export const actions: Actions = {
	default: async ({
		request,
		url: pageUrl
	}): Promise<
		| undefined
		| ValidationError<{
				formId: 'contactForm';
				state: 'invalid';
				values: { [key: string]: FormDataEntryValue | null };
				invalidValues: {
					name?: string;
					email?: string;
					message?: string;
				};
		  }>
		| {
				formId: 'contactForm';
				state: 'success';
				notification: {
					type: 'green' | 'orange' | 'blue';
					html: string;
				};
				values?: { [key: string]: FormDataEntryValue | null };
		  }
		| ValidationError<{
				formId: 'contactForm';
				state: 'error';
				notification: {
					type: 'orange' | 'blue' | 'red';
					html: string;
				};
				values: {
					[key: string]: FormDataEntryValue | null;
				};
		  }>
	> => {
		console.info('contact: +page.server.ts // Action // default');

		const data = await request.formData();

		const url = data.get('url');
		const name = data.get('name');
		const email = data.get('email');
		const message = data.get('message');

		const values: { [key: string]: FormDataEntryValue | null } = {
			url,
			name,
			email,
			message
		};

		const invalidValues: {
			name?: string;
			email?: string;
			message?: string;
		} = {};

		const nameInvalid = z
			.string()
			.min(1, { message: 'Name is required' })
			.safeParse(name);
		if (!nameInvalid.success)
			invalidValues.name = nameInvalid.error.errors[0].message;

		const emailInvalid = z
			.string()
			.min(1, { message: 'E-Mail is required' })
			.email({ message: 'Invalid E-Mail' })
			.safeParse(email);
		if (!emailInvalid.success)
			invalidValues.email = emailInvalid.error.errors[0].message;

		const messageInvalid = z
			.string()
			.min(1, { message: 'Message is required' })
			.safeParse(message);
		if (!messageInvalid.success)
			invalidValues.message = messageInvalid.error.errors[0].message;

		if (Object.keys(invalidValues).length > 0) {
			return invalid(400, {
				formId: 'contactForm',
				state: 'invalid',
				values,
				invalidValues
			});
		}

		try {
			const meResponse = await fetch(
				`${pageUrl.origin}/_api/mail/me?secret=${MAIL_SECRET}`,
				{
					method: 'POST',
					body: JSON.stringify(values)
				}
			);

			const summaryResponse = await fetch(
				`${pageUrl.origin}/_api/mail/summary?secret=${MAIL_SECRET}`,
				{
					method: 'POST',
					body: JSON.stringify({ name, email, message })
				}
			);

			if (meResponse.ok) {
				if (summaryResponse.ok) {
					return {
						formId: 'contactForm',
						state: 'success',
						notification: {
							type: 'green',
							html: `<h3>Thanks for your message ${name}!</h3><p class="text-xs">An auto-reply has been sent to <b><em>${email}</em></b></p>`
						}
					};
				}

				return {
					formId: 'contactForm',
					state: 'success',
					notification: {
						type: 'orange',
						html: `<h3>Thanks for your message ${name}!</h3><p class="text-xs">An auto-reply has been sent to <b><em>${email}</em></b>, but could not be delivered. Please check if the entered E-Mail address is correct</p>`
					},
					values
				};
			}
		} catch (error) {
			console.error(error);
		}

		// invalid infers type as string but we need it to be <'info' | 'warning' | 'error'>
		return invalid<{
			formId: 'contactForm';
			state: 'error';
			notification: {
				type: 'red';
				html: string;
			};
			values: {
				[key: string]: FormDataEntryValue | null;
			};
		}>(500, {
			formId: 'contactForm',
			state: 'error',
			notification: {
				type: 'red',
				html: '<h3>An unkown error occurred while sending your message. Please try again later</h3>'
			},
			values
		});
	}
};

export const prerender = false;
