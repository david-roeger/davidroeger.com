import { page } from '$app/stores';
import { readable } from 'svelte/store';

export function createForm<T>(formId: string) {
	const form = readable<T | undefined>(undefined, (set) => {
		page.subscribe(async (newPage) => {
			if (newPage && newPage.form && newPage.form.formId === formId) {
				set(newPage.form);
			}
		});
	});
	return {
		form
	};
}
