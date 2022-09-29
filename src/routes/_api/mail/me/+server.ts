console.info('_api/mail/me: +server.ts');

import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import nodemailer, { type Transporter } from 'nodemailer';

import {
	MAIL_SERVER,
	MAIL_ME,
	MAIL_PASSWORD,
	MAIL_SECRET
} from '$env/static/private';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { authorize, createHtmlBlock } from '../utils';

const sendMailWrapper = async (
	transporter: Transporter<SMTPTransport.SentMessageInfo>,
	mailOptions: Mail.Options
) =>
	new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				reject(error);
			} else {
				resolve(info);
			}
		});
	});

export const POST: RequestHandler = async ({ url, request }) => {
	console.info('_api/mail/me: +server.ts // POST');
	// get secret from url params
	authorize(url);

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
		port: 465,
		secure: true,
		auth: {
			type: 'login',
			user: MAIL_SERVER,
			pass: MAIL_PASSWORD
		}
	});

	try {
		const response = await sendMailWrapper(transporter, {
			from: MAIL_SERVER,
			to: MAIL_ME,
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
