console.info('contact: +page.server.ts');

import { z } from 'zod';

import { invalid, type ValidationError } from '@sveltejs/kit';
import type { Actions, ActionData } from './$types';

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
				id: string;
		  }
		| ValidationError<{
				state: 'error';
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
			const response = await fetch(`${pageUrl.origin}/_api/mail/me`, {
				method: 'POST',
				body: JSON.stringify(values)
			});

			if (response.ok) {
				const { id } = (await response.json()) as { id: string };
				return {
					state: 'success',
					id
				};
			}
		} catch (error) {
			console.error(error);
		}

		return invalid(500, {
			state: 'error',
			values
		});
	}
};

export const prerender = false;
