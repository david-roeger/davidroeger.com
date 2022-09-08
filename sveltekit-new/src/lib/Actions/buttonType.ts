import type { ActionReturnType } from '$lib/types';
import { hasParentOfType } from '$lib/Utils';

export const buttonType = (
	button: HTMLButtonElement,
	type = ''
): ActionReturnType => {
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
