console.info('_api/mail: +server.ts');

import { error, json, type RequestHandler } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

import {
	MAIL_USERNAME,
	MAIL_PASSWORD,
	MAIL_FROM,
	MAIL_TO
} from '$env/static/private';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
	host: 'smtp.strato.de',
	port: 465,
	secure: true,
	auth: {
		type: 'login',
		user: MAIL_USERNAME,
		pass: MAIL_PASSWORD
	}
});

const createBlock = (key: string, value: unknown) =>
	`<p><b>${key}:</b></p><p>${
		value?.toString ? value.toString() : JSON.stringify(value)
	}</p><hr/>`;

const sendMailWrapper = async (mailOptions: Mail.Options) =>
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
	console.info('_api/mail: +server.ts // POST');

	const body: { [key: string]: unknown } = await request.json();
	const { subject: subjectUnknown, ...unkownRest } = body;
	const subjectString: string | undefined =
		typeof subjectUnknown === 'string' ? subjectUnknown : undefined;
	const blocks = [];

	for (const key in unkownRest) {
		if (Object.prototype.hasOwnProperty.call(unkownRest, key)) {
			const unknown = unkownRest[key];
			blocks.push(createBlock(key, unknown));
		}
	}

	blocks.push(createBlock('Server Url', url));

	try {
		const response = await sendMailWrapper({
			from: MAIL_FROM,
			to: MAIL_TO,
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
