console.info('_api/mail/me: +server.ts');
import { env } from '$env/dynamic/private';

import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import nodemailer, { type Transporter } from 'nodemailer';

import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { authorize, createHtmlBlock } from '../utils';

const sendMailWrapper = async (
	transporter: Transporter<SMTPTransport.SentMessageInfo>,
	mailOptions: Mail.Options
) =>
	new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
		console.info(
			'_api/mail/me: +server.ts // sendMailWrapper // Promise // +server.ts'
		);

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error(
					'_api/mail/me: +server.ts // sendMailWrapper // Promise // +server.ts // error',
					error
				);
				reject(error);
			} else {
				console.info(
					'_api/mail/me: +server.ts // sendMailWrapper // Promise // +server.ts // info',
					info
				);
				resolve(info);
			}
		});
	});

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

	const transporter = nodemailer.createTransport({
		host: 'smtp.strato.de',
		port: 587,
		secure: true,
		auth: {
			type: 'login',
			user: env.MAIL_SERVER,
			pass: env.MAIL_PASSWORD
		}
	});

	console.info(
		'_api/mail/me: +server.ts // POST // transporter',
		transporter
	);

	try {
		const response = await sendMailWrapper(transporter, {
			from: env.MAIL_SERVER,
			to: env.MAIL_ME,
			subject: `${
				subjectString
					? `${subjectString} [automated mail]`
					: 'no subject [automated mail]'
			} (${new Date().toLocaleString()})`,
			html: blocks.join('')
		});
		console.info(
			'_api/mail/me: +server.ts // POST // sendMailWrapper // response',
			response
		);
		return json({ id: response.messageId });
	} catch (e) {
		console.error(
			'_api/mail/me: +server.ts // POST // sendMailWrapper // catch',
			e
		);
		throw error(500);
	}
};
