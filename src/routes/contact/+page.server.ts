console.info('contact: +page.server.ts');

import { z } from 'zod';

import { fail, type ActionFailure } from '@sveltejs/kit';
import type { Actions, ActionData } from './$types';
import { MAIL_SECRET } from '$env/static/private';
import {
	FORM_STATE,
	type FormError,
	type FormFailure,
	type FormSuccess
} from '$lib/Utils/Form';

export type ContactFormActionData = ActionData;

type CustomFormFailure = FormFailure<'contactForm'> & {
	values: { [key: string]: FormDataEntryValue | null };
	invalidValues: {
		name?: string;
		email?: string;
		message?: string;
	};
};

type CustomFormSuccess = FormSuccess<'contactForm'> & {
	notification: {
		type: 'green' | 'orange' | 'blue';
		html: string;
	};
};

type CustomFormError = FormError<'contactForm'> & {
	values: {
		[key: string]: FormDataEntryValue | null;
	};
	notification: {
		type: 'red';
		html: string;
	};
};

// TODO: this needs to be manually typed for now
// At least I think so
// https://github.com/sveltejs/kit/issues/7004
export const actions: Actions = {
	default: async ({
		fetch,
		request,
		url: pageUrl
	}): Promise<
		| undefined
		| ActionFailure<CustomFormFailure>
		| CustomFormSuccess
		| ActionFailure<CustomFormError>
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
			console.info(
				'contact: +page.server.ts // Action // default // invalidValues'
			);
			console.info(invalidValues);
			return fail(400, {
				formId: 'contactForm',
				state: FORM_STATE.FAILURE,
				values,
				invalidValues
			});
		}

		console.info(pageUrl.origin);
		try {
			const meResponse = await fetch(
				`/_api/mail/me?secret=${MAIL_SECRET}`,
				{
					method: 'POST',
					body: JSON.stringify(values)
				}
			);

			const summaryResponse = await fetch(
				`/_api/mail/summary?secret=${MAIL_SECRET}`,
				{
					method: 'POST',
					body: JSON.stringify({ name, email, message })
				}
			);

			if (meResponse.ok) {
				if (summaryResponse.ok) {
					return {
						formId: 'contactForm',
						state: FORM_STATE.SUCCESS,
						notification: {
							type: 'green',
							html: `<h3>Thanks for your message ${name}!</h3><p class="text-xs">An auto-reply has been sent to <b><em>${email}</em></b></p>`
						}
					};
				}

				return {
					formId: 'contactForm',
					state: FORM_STATE.SUCCESS,
					notification: {
						type: 'orange',
						html: `<h3>Thanks for your message ${name}!</h3><p class="text-xs">An auto-reply has been sent to <b><em>${email}</em></b>, but could not be delivered. Please check if the entered E-Mail address is correct</p>`
					}
				};
			}
		} catch (error) {
			console.error(error);
		}

		// fail infers type as string but we need it to be <'info' | 'warning' | 'error'>
		return fail(500, {
			formId: 'contactForm',
			state: FORM_STATE.ERROR,
			notification: {
				type: 'red',
				html: '<h3>An unkown error occurred while sending your message. Please try again later</h3>'
			},
			values
		} as const);
	}
};

export const prerender = false;
