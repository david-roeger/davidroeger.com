import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export const authorize = (url: URL) => {
	const secret = url.searchParams.get('secret');
	if (secret !== env.MAIL_SECRET) {
		throw error(401);
	}
};

export const createHtmlBlock = (key: string, value: unknown) =>
	`<p><b>${key}:</b></p><p>${
		value?.toString ? value.toString() : JSON.stringify(value)
	}</p><hr/>`;
