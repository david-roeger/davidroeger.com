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
				state: 'invalid';
				values: { [key: string]: FormDataEntryValue | null };
				missing: {
					name?: string;
					email?: string;
					message?: string;
				};
		  }>
		| {
				state: 'success';
				message: string;
				values?: { [key: string]: FormDataEntryValue | null };
		  }
		| ValidationError<{
				state: 'error';
				message: string;
				values: { [key: string]: FormDataEntryValue | null };
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

		const missing: {
			name?: string;
			email?: string;
			message?: string;
		} = {};

		const nameMissing = z
			.string()
			.min(1, { message: 'Name is required' })
			.safeParse(name);
		if (!nameMissing.success)
			missing.name = nameMissing.error.errors[0].message;

		const emailMissing = z
			.string()
			.min(1, { message: 'E-Mail is required' })
			.email({ message: 'Invalid E-Mail' })
			.safeParse(email);
		if (!emailMissing.success)
			missing.email = emailMissing.error.errors[0].message;

		const messageMissing = z
			.string()
			.min(1, { message: 'Message is required' })
			.safeParse(message);
		if (!messageMissing.success)
			missing.message = messageMissing.error.errors[0].message;

		if (Object.keys(missing).length > 0) {
			return invalid(400, {
				state: 'invalid',
				values,
				missing
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
						state: 'success',
						message: `Thanks for your message! (An auto-reply has been sent to ${email})`
					};
				}

				return {
					state: 'success',
					message: `Thanks for your message! (An auto-reply has been sent to ${email}, but could not be delivered. Please check if the entered E-Mail address is correct.)`,
					values
				};
			}
		} catch (error) {
			console.error(error);
		}

		return invalid(500, {
			state: 'error',
			message: `An error occurred while sending your message. Please try again later.`,
			values
		});
	}
};

export const prerender = false;
