import { hasParentOfType } from '$utils';
import type { ActionReturnType } from '$lib/types';
/**
 * Usage: <div use:buttonType> or <div use:buttonType={string}>
 *
 * @param { HTMLElement } node Comes from Svelte
 * @param { string } type explicit button type
 */

export const buttonType = (button: HTMLButtonElement, type = ''): ActionReturnType => {
	const update = (button: HTMLButtonElement) => {
		if (type) {
			button.type = type;
			return;
		}
		if (hasParentOfType(button, 'form')) {
			button.type = 'button';
		}
	};
	update(button);

	return {
		update
	};
};
