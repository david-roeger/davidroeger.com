console.info('contact: +page.server.ts');

import { invalid } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, url: pageUrl }) => {
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
				missing: { email: !email, name: !name, message: !message },
				id: undefined
			});
		}

		console.log(pageUrl);
		try {
			const response = await fetch(`${pageUrl.origin}/_api/mail`, {
				method: 'POST',
				body: JSON.stringify(values)
			});

			console.log('Mail Fetch', response.status);

			if (response.status <= 299) {
				const { id } = (await response.json()) as { id: string };
				return {
					state: 'success',
					values: undefined,
					missing: undefined,
					id
				};
			}
		} catch (error) {
			console.error(error);
		}

		return invalid(500, {
			state: 'server error',
			values,
			missing: undefined,
			id: undefined
		});
	}
};

export const prerender = false;
