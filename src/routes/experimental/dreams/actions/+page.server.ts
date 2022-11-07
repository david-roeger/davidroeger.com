console.info('experimental/dreams/login: +page.server.ts');
export const prerender = false;

import type { Dream } from '$lib/types';
import {
	FORM_STATE,
	type FormError,
	type FormInvalid,
	type FormSuccess
} from '$utils/Form';
import {
	deleteDream,
	insertDream,
	updateDream
} from '$utils/Dreams/supabaseRequest';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid, type ValidationError } from '@sveltejs/kit';
import { z } from 'zod';
import type { ActionData, Actions } from './$types';

type CustomFormInvalid<
	T extends string,
	U extends Record<string, string | undefined>
> = FormInvalid<T> & {
	values: { [key: string]: FormDataEntryValue | null };
	invalidValues: U;
};

type CustomFormSuccess<T extends string> = FormSuccess<T>;

type CustomFormError<T extends string> = FormError<T> & {
	values: {
		[key: string]: FormDataEntryValue | null;
	};
	notification: {
		type: 'red';
		html: string;
	};
};

// insert dream ---------------------------------------------------------------
type InsertFormInvalid = CustomFormInvalid<
	'dreamsInsertForm',
	{
		default?: string;
		text?: string;
		emoji?: string;
	}
>;
type InsertFormError = CustomFormError<'dreamsInsertForm'>;
type InsertFormSuccess = CustomFormSuccess<'dreamsInsertForm'> & {
	dream: Dream;
};

export type DreamsInsertFormActionData =
	| Extract<ActionData, { formId: 'dreamsInsertForm' }>
	| undefined;

// edit dream ---------------------------------------------------------------
type EditFormInvalid = CustomFormInvalid<
	'dreamsEditForm',
	{
		default?: string;
		text?: string;
		emoji?: string;
	}
>;
type EditFormError = CustomFormError<'dreamsEditForm'>;
type EditFormSuccess = CustomFormSuccess<'dreamsEditForm'> & {
	dream: Dream;
};

export type DreamsEditFormActionData =
	| Extract<ActionData, { formId: 'dreamsEditForm' }>
	| undefined;

// remove dream ---------------------------------------------------------------
type RemoveFormInvalid = CustomFormInvalid<
	'dreamsRemoveForm',
	{
		default?: string;
	}
>;
type RemoveFormError = CustomFormError<'dreamsRemoveForm'>;
type RemoveFormSuccess = CustomFormSuccess<'dreamsRemoveForm'> & {
	dreamId: number;
};

export type DreamsRemoveFormActionData =
	| Extract<ActionData, { formId: 'dreamsRemoveForm' }>
	| undefined;

export const actions: Actions = {
	insert: async (
		event
	): Promise<
		| undefined
		| ValidationError<InsertFormInvalid>
		| ValidationError<InsertFormError>
		| InsertFormSuccess
	> => {
		console.info(
			'experimental/dreams/login: +page.server.ts // Action // insert'
		);

		const { request } = event;
		const { supabaseClient } = await getSupabase(event);

		const formData = await request.formData();

		const text = formData.get('text') as string;
		const emoji = formData.get('emoji') as string;
		const createdBy = formData.get('createdBy') as string;

		const values: { [key: string]: FormDataEntryValue | null } = {
			text,
			emoji
		};

		const invalidValues: {
			default?: string;
			text?: string;
			emoji?: string;
		} = {};

		const createdByInvalid = z.string().min(1).safeParse(createdBy);
		if (!createdByInvalid.success) {
			return invalid<InsertFormError>(401, {
				formId: 'dreamsInsertForm',
				state: FORM_STATE.ERROR,
				notification: {
					type: 'red',
					html: 'Not authorized.'
				},
				values
			});
		}

		const textInvalid = z
			.string()
			.min(1, { message: 'Text is required' })
			.safeParse(text);
		if (!textInvalid.success)
			invalidValues.text = textInvalid.error.errors[0].message;

		const emojiInvalid = z
			.string()
			.min(1, { message: 'Emoji is required' })
			.safeParse(emoji);
		if (!emojiInvalid.success)
			invalidValues.emoji = emojiInvalid.error.errors[0].message;

		if (Object.keys(invalidValues).length > 0) {
			return invalid<InsertFormInvalid>(400, {
				formId: 'dreamsInsertForm',
				state: FORM_STATE.INVALID,
				values,
				invalidValues
			});
		}

		const response = await insertDream(
			{
				text,
				emoji,
				created_by: createdBy
			},
			supabaseClient
		);

		if (response.error) {
			return invalid<InsertFormError>(response.status ?? 500, {
				formId: 'dreamsInsertForm',
				state: FORM_STATE.ERROR,
				notification: {
					type: 'red',
					html: `Something went wrong. ${response.error.message}`
				},
				values
			});
		}

		if (!response.dream) {
			return invalid<InsertFormError>(500, {
				formId: 'dreamsInsertForm',
				state: FORM_STATE.ERROR,
				notification: {
					type: 'red',
					html: 'Something went wrong. No dream was returned.'
				},
				values
			});
		}

		return {
			formId: 'dreamsInsertForm',
			state: FORM_STATE.SUCCESS,
			dream: response.dream
		};
	},
	edit: async (
		event
	): Promise<
		| undefined
		| ValidationError<EditFormInvalid>
		| ValidationError<EditFormError>
		| EditFormSuccess
	> => {
		console.info(
			'experimental/dreams/login: +page.server.ts // Action // edit'
		);

		const { request } = event;
		const { supabaseClient } = await getSupabase(event);

		const formData = await request.formData();

		const text = formData.get('text') as string;
		const emoji = formData.get('emoji') as string;
		const dreamId = parseInt(formData.get('dreamId') as string);

		const values: { [key: string]: FormDataEntryValue | null } = {
			text,
			emoji,
			dreamId: dreamId.toString()
		};

		const invalidValues: {
			default?: string;
			text?: string;
			emoji?: string;
		} = {};

		const dreamIdInvalid = z.number().safeParse(dreamId);
		if (!dreamIdInvalid.success) {
			return invalid<EditFormError>(500, {
				formId: 'dreamsEditForm',
				state: FORM_STATE.ERROR,
				notification: {
					type: 'red',
					html: 'Something went wrong. Please try again later.'
				},
				values
			});
		}

		const textInvalid = z
			.string()
			.min(1, { message: 'Text is required' })
			.safeParse(text);
		if (!textInvalid.success)
			invalidValues.text = textInvalid.error.errors[0].message;

		const emojiInvalid = z
			.string()
			.min(1, { message: 'Emoji is required' })
			.safeParse(emoji);
		if (!emojiInvalid.success)
			invalidValues.emoji = emojiInvalid.error.errors[0].message;

		if (Object.keys(invalidValues).length > 0) {
			return invalid<EditFormInvalid>(400, {
				formId: 'dreamsEditForm',
				state: FORM_STATE.INVALID,
				values,
				invalidValues
			});
		}

		const response = await updateDream(
			{
				text,
				emoji,
				id: dreamId
			},
			supabaseClient
		);

		if (response.error) {
			return invalid<EditFormError>(response.status ?? 500, {
				formId: 'dreamsEditForm',
				state: FORM_STATE.ERROR,
				notification: {
					type: 'red',
					html: `Something went wrong. ${response.error.message}`
				},
				values
			});
		}

		if (!response.dream) {
			return invalid<EditFormError>(500, {
				formId: 'dreamsEditForm',
				state: FORM_STATE.ERROR,
				notification: {
					type: 'red',
					html: 'Something went wrong. No dream was returned.'
				},
				values
			});
		}

		return {
			formId: 'dreamsEditForm',
			state: FORM_STATE.SUCCESS,
			dream: response.dream
		};
	},
	remove: async (
		event
	): Promise<
		| undefined
		| ValidationError<RemoveFormInvalid>
		| ValidationError<RemoveFormError>
		| RemoveFormSuccess
	> => {
		console.info(
			'experimental/dreams/login: +page.server.ts // Action // remove'
		);

		const { request } = event;
		const { supabaseClient } = await getSupabase(event);

		const formData = await request.formData();

		const dreamId = parseInt(formData.get('dreamId') as string);

		const values: { [key: string]: FormDataEntryValue | null } = {
			dreamId: dreamId.toString()
		};

		const dreamIdInvalid = z.number().safeParse(dreamId);
		if (!dreamIdInvalid.success) {
			return invalid<RemoveFormInvalid>(400, {
				formId: 'dreamsRemoveForm',
				state: FORM_STATE.INVALID,
				values,
				invalidValues: {
					default: 'Something went wrong. Please try again later.'
				}
			});
		}

		const response = await deleteDream(
			{
				id: dreamId
			},
			supabaseClient
		);

		if (response.error) {
			return invalid<RemoveFormError>(response.status ?? 500, {
				formId: 'dreamsRemoveForm',
				state: FORM_STATE.ERROR,
				notification: {
					type: 'red',
					html: `Something went wrong. ${response.error.message}`
				},
				values
			});
		}

		if (!response.dream) {
			return invalid<RemoveFormError>(500, {
				formId: 'dreamsRemoveForm',
				state: FORM_STATE.ERROR,
				notification: {
					type: 'red',
					html: 'Something went wrong. No dream was returned.'
				},
				values
			});
		}

		return {
			formId: 'dreamsRemoveForm',
			state: FORM_STATE.SUCCESS,
			dreamId: response.dream.id
		};
	}
};
