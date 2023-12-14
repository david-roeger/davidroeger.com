import { applyAction, deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import type { ActionReturnType } from '$types';
import type { ActionResult } from '@sveltejs/kit';
import { tick } from 'svelte';
import { readable, writable } from 'svelte/store';

export enum FORM_STATE {
	'IDLE' = 'idle',
	'SUBMITTING' = 'submitting',
	'FAILURE' = 'failure',
	'ERROR' = 'error',
	'SUCCESS' = 'success',
	'REDIRECT' = 'redirect'
}

type FormBase<ID extends string> = {
	formId: ID;
	state: FORM_STATE;
};

export type FormFailure<ID extends string> = FormBase<ID> & {
	state: FORM_STATE.FAILURE;
	invalidValues?: { [key: string]: string };
};

export type FormSuccess<ID extends string> = FormBase<ID> & {
	state: FORM_STATE.SUCCESS;
};

export type FormError<ID extends string> = FormBase<ID> & {
	state: FORM_STATE.ERROR;
};

export type Form<ID extends string> =
	| (undefined | FormFailure<ID> | FormSuccess<ID> | FormError<ID>)
	| null;

const focusInvalid = async (
	invalid: { [key: string]: string } | undefined,
	form: HTMLFormElement
) => {
	if (invalid) {
		const activeElement = document.activeElement;
		const name = activeElement?.getAttribute('name');
		if (name && form.contains(activeElement) && invalid[name]) {
			return;
		}

		for (const [key, value] of Object.entries(invalid)) {
			if (value) {
				const element = form.querySelector(
					`:scope [name='${key}']`
				) as HTMLElement | null;
				if (element) {
					await tick();
					element.focus();
				}
				return;
			}
		}
	}
};

// TODO: Refactor formId to be a generic type
export function createForm<T extends Form<ID>, ID extends string>(
	formId: ID,
	resetOnsuccess = true
) {
	const form = readable<T>(undefined, (set) => {
		page.subscribe(async (newPage) => {
			const newForm = newPage?.form as T;
			if (newForm && newForm.formId === formId) {
				set(newForm);
			}
		});
	});

	const state = writable<FORM_STATE>(FORM_STATE.IDLE);
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

				state.set(FORM_STATE.SUBMITTING);
				// TODO: add delay handling
				// if the server responds quickly, the form will flicker
				// because the loading state is rendered only for a short time
				// this is unwanted, so we should add a handling

				const data = new FormData(form);

				const response = await fetch(form.action, {
					method: 'POST',
					body: data
				});

				const result: ActionResult = deserialize(await response.text());

				switch (result.type) {
					case FORM_STATE.SUCCESS:
						if (resetOnsuccess) form.reset();
						if (activeElement && form.contains(activeElement)) {
							activeElement.blur();
						}
						await invalidateAll();
						break;
					case FORM_STATE.FAILURE: {
						const data = result.data as T;
						if (
							data &&
							data.state === FORM_STATE.FAILURE &&
							data.invalidValues
						) {
							// we need to manully override the form state
							// because otherwise the fielgroup will still
							// be disabled when we try to focus the input
							// await tick won't work here because the form
							// store is only update after applyAction
							state.set(FORM_STATE.FAILURE);
							await focusInvalid(data.invalidValues, form);
						}
						break;
					}

					case FORM_STATE.REDIRECT:
						await invalidateAll();
						break;
					case FORM_STATE.ERROR:
						break;
					default: {
						// TODO: find out how to use this with enums
						// Use never type here
						// const exhaustiveCheck: never = result;
						// throw new Error(exhaustiveCheck);
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
