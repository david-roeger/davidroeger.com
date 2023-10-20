import type { FormApi } from '@tanstack/form-core';
import { getContext, setContext } from 'svelte';

export type FormContext = {
	formApi: FormApi<any>;
	parentFieldName?: string;
} | null;

export const formContext = Symbol('FormContext');

export function setFormContext(val: FormContext) {
	setContext(formContext, val);
}

export function useFormContext() {
	const formApi = getContext(formContext) as FormContext;

	if (!formApi) {
		throw new Error(
			`You are trying to use the form API outside of a form!`
		);
	}

	return formApi;
}
