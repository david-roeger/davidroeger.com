logger.page('experimental/dreams: +page.server.ts');
// ----------------------------------------------------------------

import { fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';

import {
	addDreamFormSchema,
	type AddDreamFormMessage,
	type ZodAddDreamForm
} from '$slices/AddDreamForm/constants';

import client from '$utils/Db/client';
import { logger } from '$utils/logger';

import {
	editDreamFormSchema,
	type EditDreamFormMessage,
	type ZodEditDreamForm
} from '$slices/EditDreamForm/constants';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	logger.page('experimental/dreams: +page.server.ts // load');
	// ----------------------------------------------------------------

	const session = await locals.auth.validate();
	if (!session) redirect(302, '/experimental/dreams/login');

	return {
		user: session.user
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		logger.page('contact: +page.server.ts // Action // add');
		// ----------------------------------------------------------------

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

		try {
			const result = await client.query(
				`INSERT INTO dreams (created_by, text, emoji) VALUES ($1, $2, $3)`,
				[
					addDreamForm.data.userId,
					addDreamForm.data.text,
					addDreamForm.data.emoji
				]
			);

			return message(addDreamForm, {
				type: 'green',
				html: `<h3>Thanks for your message!</h3>`
			});
		} catch (e) {
			logger.error(e);
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
	},
	edit: async ({ request, locals }) => {
		logger.page('contact: +page.server.ts // Action // edit');
		// ----------------------------------------------------------------

		const editDreamForm = await superValidate<
			ZodEditDreamForm,
			EditDreamFormMessage
		>(request, editDreamFormSchema);

		editDreamForm.id = `editDreamForm-${editDreamForm.data.dreamId}`;

		// Convenient validation check:
		if (!editDreamForm.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { editDreamForm });
		}

		// unauthorized
		const session = await locals.auth.validate();
		if (!session) {
			return message(
				editDreamForm,
				{
					type: 'red',
					html: `<h3>Unauthorized</h3>`
				},
				{
					status: 401
				}
			);
		}

		if (session.user.userId !== editDreamForm.data.userId) {
			return message(
				editDreamForm,
				{
					type: 'red',
					html: `<h3>Forbidden</h3>`
				},
				{
					status: 403
				}
			);
		}

		try {
			const result = await client.query(
				`UPDATE dreams SET text = $1, emoji = $2 WHERE id = $3 AND created_by = $4`,
				[
					editDreamForm.data.text,
					editDreamForm.data.emoji,
					editDreamForm.data.dreamId,
					editDreamForm.data.userId
				]
			);

			if (result.rowCount === 0) {
				return message(
					editDreamForm,
					{
						type: 'red',
						html: `<h3>Not found</h3>`
					},
					{
						status: 404
					}
				);
			}

			return message(editDreamForm, {
				type: 'blue',
				html: `<h3>Dream Updated!</h3>`
			});
		} catch (e) {
			logger.error(e);
		}

		return message(
			editDreamForm,
			{
				type: 'red',
				html: '<h3>An unkown error occurred. Please try again later</h3>'
			},
			{
				status: 500
			}
		);
	}
};

export const prerender = false;
