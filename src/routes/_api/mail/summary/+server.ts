logger.page('_api/mail/summary: +server.ts');
// ----------------------------------------------------------------

import { error, json } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import { logger } from '$utils/logger';

import type { RequestHandler } from './$types';

import { authorize, sendMailWrapper } from '../utils';

export const POST: RequestHandler = async ({ url, request }) => {
	logger.page('_api/mail/summary: +server.ts // POST');

	authorize(url);

	const body: { [key: string]: unknown } = await request.json();
	const { name, email, message } = body;

	if (
		!name ||
		typeof name !== 'string' ||
		!email ||
		typeof email !== 'string' ||
		!message ||
		typeof message !== 'string'
	) {
		throw error(400);
	}

	const html = `
		<h1>Hi ${name},</h1>
		<p>Thanks for your message.</p>
		<p>I will get back to you as soon as possible.</p>
		<br />
		<p>Best regards,</p>
		<p><b>David</b></p>
		<p><em>${env.MAIL_ME}</em></p>
	`;
	const summaryBlock = message
		? `
			<br />
			<br />
			<hr />
			<p>
				<b>Summary:</b>
			</p>
			<p>${message}</p>`
		: '';

	try {
		const response = await sendMailWrapper({
			from: env.MAIL_NO_REPLY,
			to: email,
			subject: `Summary from davidroeger.com [automated mail]`,
			html: html.concat(summaryBlock)
		});

		return json({ id: response.messageId });
	} catch (e) {
		logger.error(e);
		throw error(500);
	}
};
