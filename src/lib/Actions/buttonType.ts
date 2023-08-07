import type { ActionReturnType } from '$types';
import { hasParentOfType } from '$utils';

export const buttonType = (
	button: HTMLButtonElement,
	type: 'button' | 'reset' | 'submit' = 'button'
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
