import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { DEV_LOGIN } from '$env/static/private';

export const handle: Handle = async ({ resolve, event }) => {
	const url = new URL(event.request.url);

	if (url.href.includes('dev')) {
		const auth = event.request.headers.get('Authorization');
		if (auth !== `Basic ${Buffer.from(DEV_LOGIN).toString('base64')}`) {
			return new Response('Not authorized', {
				status: 401,
				headers: {
					'WWW-Authenticate':
						'Basic realm="User Visible Realm", charset="UTF-8"'
				}
			});
		}
	}

	return resolve(event);
};
