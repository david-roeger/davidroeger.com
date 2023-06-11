console.info('_api/mail/me: +server.ts');
import { env } from '$env/dynamic/private';

import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { authorize, createHtmlBlock, sendMailWrapper } from '../utils';

export const POST: RequestHandler = async ({ url, request }) => {
	console.info('_api/mail/me: +server.ts // POST');
	// get secret from url params
	authorize(url);
	console.info(
		'_api/mail/me: +server.ts // POST // authorized',
		env.MAIL_SERVER,
		env.MAIL_PASSWORD
	);
	const body: { [key: string]: unknown } = await request.json();
	const { subject: subjectUnknown, ...unkownRest } = body;
	const subjectString: string | undefined =
		typeof subjectUnknown === 'string' ? subjectUnknown : undefined;
	const blocks = [];

	for (const key in unkownRest) {
		if (Object.prototype.hasOwnProperty.call(unkownRest, key)) {
			const unknown = unkownRest[key];
			blocks.push(createHtmlBlock(key, unknown));
		}
	}

	blocks.push(createHtmlBlock('Server Url', url));

	try {
		const response = await sendMailWrapper({
			from: env.MAIL_SERVER,
			to: env.MAIL_ME,
			subject: `${
				subjectString
					? `${subjectString} [automated mail]`
					: 'no subject [automated mail]'
			} (${new Date().toLocaleString()})`,
			html: blocks.join('')
		});

		return json({ id: response.messageId });
	} catch (e) {
		throw error(500);
	}
};
