console.info('experimental/dreams: +page.server.ts');
import { error, fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

import client from '$lib/Utils/Db/client';
import { message, superValidate } from 'sveltekit-superforms/server';
import {
	addDreamFormSchema,
	type AddDreamFormMessage,
	type ZodAddDreamForm
} from '$lib/Slices/AddDreamForm/constants';

export const load: PageServerLoad = async ({ locals }) => {
	console.info('experimental/dreams: +page.server.ts // load');

	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/experimental/dreams/login');

	return {
		user: session.user
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		console.info('contact: +page.server.ts // Action // add');

		const addDreamForm = await superValidate<
			ZodAddDreamForm,
			AddDreamFormMessage
		>(request, addDreamFormSchema, {
			id: 'dreamForm'
		});

		// Convenient validation check:
		if (!addDreamForm.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { addDreamForm });
		}

		// unauthorized
		const session = await locals.auth.validate();
		if (!session) {
			return message(
				addDreamForm,
				{
					type: 'red',
					html: `<h3>Unauthorized</h3>`
				},
				{
					status: 401
				}
			);
		}

		if (session.user.userId !== addDreamForm.data.userId) {
			return message(
				addDreamForm,
				{
					type: 'red',
					html: `<h3>Forbidden</h3>`
				},
				{
					status: 403
				}
			);
		}

		const result = await client.query(
			`INSERT INTO dreams (created_by, text, emoji) VALUES ($1, $2, $3)`,
			[
				addDreamForm.data.userId,
				addDreamForm.data.text,
				addDreamForm.data.emoji
			]
		);
		try {
			return message(addDreamForm, {
				type: 'green',
				html: `<h3>Thanks for your message!</h3>`
			});
		} catch (error) {
			console.error(error);
		}

		return message(
			addDreamForm,
			{
				type: 'red',
				html: '<h3>An unkown error occurred while sending your message. Please try again later</h3>'
			},
			{
				status: 500
			}
		);
	}
};

export const prerender = false;
