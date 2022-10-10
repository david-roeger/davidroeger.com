import { page } from '$app/stores';
import { readable, writable } from 'svelte/store';

type Form =
	| undefined
	| {
			formId: string;
			[key: string]: unknown;
	  };

export function createForm<T extends Form>(formId: string) {
	const form = readable<T>(undefined, (set) => {
		page.subscribe(async (newPage) => {
			const newForm = newPage?.form as T;
			if (newForm && newForm.formId === formId) {
				set(newForm);
			}
		});
	});

	const state = writable<string>('idle');
	form.subscribe((newForm) => {
		if (newForm && newForm.state) {
			state.set(newForm.state as string);
		}
	});

	return {
		form,
		state
	};
}
