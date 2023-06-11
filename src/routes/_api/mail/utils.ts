import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

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

export const sendMailWrapper = async (mailOptions: Mail.Options) =>
	new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error(error);
				reject(error);
			} else {
				resolve(info);
			}
		});
	});
