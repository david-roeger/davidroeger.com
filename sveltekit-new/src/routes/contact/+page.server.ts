console.info('contact: +page.server.ts');

import { invalid } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const url = data.get('url');
		const email = data.get('email');
		const name = data.get('name');
		const message = data.get('message');

		const values: { [key: string]: FormDataEntryValue | null } = {
			url,
			email,
			name,
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

		const response = await fetch('http://127.0.0.1:5173/_api/mail', {
			method: 'POST',
			body: JSON.stringify(values)
		});

		if (response.status <= 299) {
			const { id } = (await response.json()) as { id: string };
			return {
				state: 'success',
				values: undefined,
				missing: undefined,
				id
			};
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
