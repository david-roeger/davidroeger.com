import { invalid } from '@sveltejs/kit';
import type { Actions } from './$types';

export const prerender = false;
// TODO: this needs to be manually typed for now
// At least I think so
// https://github.com/sveltejs/kit/issues/7004
export const actions: Actions = {
	second: async ({ request }) => {
		const data = await request.formData();
		const first = data.get('first');
		const second = data.get('second');
		console.log(first, second);
		if (first && second) {
			return {
				message: 'success',
				values: {}
			};
		}

		return invalid(400, {
			message: 'error',
			values: {
				first,
				second
			}
		});
	}
};
