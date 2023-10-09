import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
import type { Writable } from 'svelte/store';

import type {
	SuperValidated,
	UnwrapEffects,
	ZodValidation
} from 'sveltekit-superforms';
import {
	superForm,
	type FormOptions,
	type SuperForm
} from 'sveltekit-superforms/client';
import type { AnyZodObject } from 'zod';

export type MaybePromise<T> = T | Promise<T>;

// onMutate?: (variables: TVariables) => Promise<TContext | undefined> | TContext | undefined;
// onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => Promise<unknown> | unknown;
// onError?: (error: TError, variables: TVariables, context: TContext | undefined) => Promise<unknown> | unknown;
// onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables, context: TContext | undefined) => Promise<unknown> | unknown;

type FormOptionsWithContext<
	T extends ZodValidation<AnyZodObject>,
	M = any,
	TContext = unknown
> = Omit<
	FormOptions<T, M>,
	'onSubmit' | 'onResult' | 'onUpdate' | 'onUpdated' | 'onError'
> & {
	onSubmit?: (
		...params: Parameters<SubmitFunction>
	) => MaybePromise<TContext | undefined>;

	onResult?: (
		event: {
			result: ActionResult;
			formEl: HTMLFormElement;
			cancel: () => void;
		},
		context: TContext | undefined
	) => MaybePromise<unknown | void>;
	onUpdate?: (
		event: {
			form: SuperValidated<UnwrapEffects<T>, M>;
			formEl: HTMLFormElement;
			cancel: () => void;
		},
		context: TContext | undefined
	) => MaybePromise<unknown | void>;
	onUpdated?: (
		event: {
			form: Readonly<SuperValidated<UnwrapEffects<T>, M>>;
		},
		context: TContext | undefined
	) => MaybePromise<unknown | void>;

	onError?:
		| 'apply'
		| ((
				event: {
					result: {
						type: 'error';
						status?: number;
						error: App.Error;
					};
					message: Writable<
						SuperValidated<UnwrapEffects<T>, M>['message']
					>;
				},
				context: TContext | undefined
		  ) => MaybePromise<unknown | void>);
};

export function superFormWithContext<
	T extends ZodValidation<AnyZodObject> = ZodValidation<AnyZodObject>,
	M = any,
	TContext = unknown
>(
	form: SuperValidated<T, M>,
	optionsWithContext?: FormOptionsWithContext<UnwrapEffects<T>, M, TContext>
): SuperForm<UnwrapEffects<T>, M> {
	if (!optionsWithContext) {
		return superForm(form);
	}

	const {
		onSubmit: onSubmitWithContext,
		onResult: onResultWithContext,
		onUpdate: onUpdateWithContext,
		onUpdated: onUpdatedWithContext,
		onError: onErrorWithContext,
		...rest
	} = optionsWithContext;

	const options: FormOptions<UnwrapEffects<T>, M> = {
		...rest
	};

	let context: TContext | undefined;

	const cleanUp = () => {
		context = undefined;
	};

	if (onSubmitWithContext) {
		options.onSubmit = async (input) => {
			const { cancel, ...rest } = input;
			const updatedParam = {
				cancel() {
					cancel();
					cleanUp();
				},
				...rest
			};
			context = await onSubmitWithContext(updatedParam);
		};
	}

	if (onResultWithContext) {
		options.onResult = async (event) => {
			const { cancel, ...rest } = event;
			const updatedEvent = {
				cancel() {
					cancel();
					cleanUp();
				},
				...rest
			};

			await onResultWithContext(updatedEvent, context);
			if (updatedEvent.result.type === 'redirect') {
				cleanUp();
			}
		};
	}

	if (onUpdateWithContext) {
		options.onUpdate = async (event) => {
			const { cancel, ...rest } = event;
			const updatedEvent = {
				cancel() {
					cancel();
					cleanUp();
				},
				...rest
			};
			await onUpdateWithContext(updatedEvent, context);
		};
	}

	if (onUpdatedWithContext) {
		options.onUpdated = async (event) => {
			await onUpdatedWithContext(event, context);
			cleanUp();
		};
	}

	if (onErrorWithContext) {
		if (typeof onErrorWithContext === 'string') {
			options.onError = onErrorWithContext;
		} else {
			options.onError = async (event) => {
				await onErrorWithContext(event, context);
			};
		}

		cleanUp();
	}

	return superForm(form, options);
}
