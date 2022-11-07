console.info('experimental/dreams/login: +page.server.ts');

export const prerender = false;

import {
	FORM_STATE,
	type Form,
	type FormError,
	type FormInvalid,
	type FormSuccess
} from '$utils/Form';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { AuthApiError } from '@supabase/supabase-js';
import { invalid, type ValidationError } from '@sveltejs/kit';
import { z } from 'zod';
import type { ActionData, Actions } from './$types';

export type DreamsLoginFormActionData = ActionData & Form<'dreamsLoginForm'>;

type CustomFormInvalid = FormInvalid<'dreamsLoginForm'> & {
	values: { [key: string]: FormDataEntryValue | null };
	invalidValues: {
		default?: string;
		email?: string;
		password?: string;
	};
};

type CustomFormSuccess = FormSuccess<'dreamsLoginForm'> & {
	notification: {
		type: 'green' | 'orange' | 'blue';
		html: string;
	};
};

type CustomFormError = FormError<'dreamsLoginForm'> & {
	values: {
		[key: string]: FormDataEntryValue | null;
	};
	notification: {
		type: 'red';
		html: string;
	};
};

export const actions: Actions = {
	default: async (
		event
	): Promise<
		| undefined
		| ValidationError<CustomFormInvalid>
		| CustomFormSuccess
		| ValidationError<CustomFormError>
	> => {
		console.info(
			'experimental/dreams/login: +page.server.ts // Action // default'
		);

		const { request } = event;
		const { supabaseClient } = await getSupabase(event);

		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const values: { [key: string]: FormDataEntryValue | null } = {
			email,
			password
		};

		const invalidValues: {
			email?: string;
			password?: string;
		} = {};

		const emailInvalid = z
			.string()
			.min(1, { message: 'E-Mail is required' })
			.email({ message: 'Invalid E-Mail' })
			.safeParse(email);
		if (!emailInvalid.success)
			invalidValues.email = emailInvalid.error.errors[0].message;

		const passwordInvalid = z
			.string()
			.min(1, { message: 'Password is required' })
			.safeParse(password);
		if (!passwordInvalid.success)
			invalidValues.password = passwordInvalid.error.errors[0].message;

		if (Object.keys(invalidValues).length > 0) {
			return invalid<CustomFormInvalid>(400, {
				formId: 'dreamsLoginForm',
				state: FORM_STATE.INVALID,
				values,
				invalidValues
			});
		}

		const { error } = await supabaseClient.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return invalid<CustomFormInvalid>(400, {
					formId: 'dreamsLoginForm',
					state: FORM_STATE.INVALID,
					values,
					invalidValues: {
						default: 'Invalid Credentials'
					}
				});
			}

			return invalid<CustomFormError>(500, {
				formId: 'dreamsLoginForm',
				state: FORM_STATE.ERROR,
				notification: {
					type: 'red',
					html: 'Something went wrong. Please try again later.'
				},
				values
			});
		}

		return {
			formId: 'dreamsLoginForm',
			state: FORM_STATE.SUCCESS,
			notification: {
				type: 'blue',
				html: `<h3>All good!</h3><p>You are now logged in.</p>`
			}
		};
	}
};
