console.info('contact: +page.server.ts');

import { invalid, type ValidationError } from '@sveltejs/kit';
import type { Actions } from './$types';

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
					name: boolean;
					email: boolean;
					message: boolean;
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
		const tel = data.get('tel');
		const message = data.get('message');

		const values: { [key: string]: FormDataEntryValue | null } = {
			url,
			name,
			email,
			tel,
			message
		};

		if (!message || !name || !email) {
			return invalid(400, {
				state: 'invalid',
				values,
				missing: { name: !name, email: !email, message: !message }
			});
		}

		try {
			const response = await fetch(`${pageUrl.origin}/_api/mail`, {
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
