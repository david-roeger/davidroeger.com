console.info('_api/mail/summary: +server.ts');

import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import nodemailer, { type Transporter } from 'nodemailer';

import { env } from '$env/dynamic/private';
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
	console.info('_api/mail/summary: +server.ts // POST');

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

	const transporter = nodemailer.createTransport({
		host: 'smtp.strato.de',
		port: 465,
		secure: true,
		auth: {
			type: 'login',
			user: env.MAIL_SERVER,
			pass: env.MAIL_PASSWORD
		}
	});

	try {
		const response = await sendMailWrapper(transporter, {
			from: env.MAIL_NO_REPLY,
			to: email,
			subject: `Summary from davidroeger.com [automated mail]`,
			html: html.concat(summaryBlock)
		});
		console.info(
			'_api/mail/summary: +server.ts // POST // sendMailWrapper // response',
			response
		);
		return json({ id: response.messageId });
	} catch (e) {
		console.error(
			'_api/mail/summary: +server.ts // POST // sendMailWrapper // catch',
			e
		);
		throw error(500);
	}
};
