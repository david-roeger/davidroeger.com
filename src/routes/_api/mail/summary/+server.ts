console.info('_api/mail/me: +server.ts');

import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import nodemailer, { type Transporter } from 'nodemailer';

import {
	MAIL_NO_REPLY,
	MAIL_ME,
	MAIL_PASSWORD,
	MAIL_SERVER
} from '$env/static/private';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { authorize } from '../utils';

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
		<p><em>${MAIL_ME}</em></p>
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
			from: MAIL_NO_REPLY,
			to: email,
			subject: `Summary from davidroeger.com [automated mail]`,
			html: html.concat(summaryBlock)
		});
		return json({ id: response.messageId });
	} catch (e) {
		throw error(500);
	}
};
