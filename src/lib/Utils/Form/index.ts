import { page } from '$app/stores';
import { readable, writable } from 'svelte/store';
import { tick } from 'svelte';
import type { ActionReturnType } from '$lib/types';
import type { ActionResult } from '@sveltejs/kit';
import { invalidateAll } from '$app/navigation';
import { applyAction } from '$app/forms';

type State = 'idle' | 'submitting' | 'invalid' | 'error' | 'success';

export type Form =
	| undefined
	| {
			formId: string;
			invalidValues?: { [key: string]: string };
			state: State;
			[key: string]: unknown;
	  };

const focusInvalid = async (invalid: { [key: string]: string } | undefined) => {
	if (invalid) {
		const activeElement = document.activeElement;
		const name = activeElement?.getAttribute('name');
		if (name && invalid[name]) {
			return;
		}

		for (const [key, value] of Object.entries(invalid)) {
			if (value) {
				const element = document.getElementsByName(key)[0];
				if (element) {
					await tick();
					element.focus();
				}
				return;
			}
		}
	}
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

	const state = writable<State>('idle');
	form.subscribe((newForm) => {
		if (newForm && newForm.state) {
			state.set(newForm.state);
		}
	});

	const enhance = (form: HTMLFormElement): ActionReturnType => {
		async function handleSubmit(e: SubmitEvent) {
			e.preventDefault();
			if (form) {
				const activeElement =
					document.activeElement as HTMLElement | null;

				state.set('submitting');
				// TODO: add delay handling
				// if the server responds quickly, the form will flicker
				// because the loading state is rendered only for a short time
				// this is unwanted, so we should add a handling

				const data = new FormData(form);

				const response = await fetch(form.action, {
					method: 'POST',
					body: data
				});

				const result: ActionResult = await response.json();
				if (result.type === 'success') {
					form.reset();
					if (activeElement && form.contains(activeElement)) {
						activeElement.blur();
					}
					await invalidateAll();
				}

				if (result.type === 'invalid') {
					const data = result.data as T;
					if (
						data &&
						data.state === 'invalid' &&
						data.invalidValues
					) {
						// we need to manully override the form state
						// because otherwise the fielgroup will still
						// be disabled when we try to focus the input
						// await tick won't work here because the form
						// store is only update after applyAction
						state.set('invalid');
						await focusInvalid(data.invalidValues);
					}
				}

				await applyAction(result);
			}
		}

		function update() {
			form.addEventListener('submit', handleSubmit);
		}

		update();

		return {
			update,
			destroy() {
				form.removeEventListener('submit', handleSubmit);
			}
		};
	};

	return {
		form,
		state,
		enhance
	};
}
