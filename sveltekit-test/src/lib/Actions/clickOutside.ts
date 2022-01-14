import type { ActionReturnType } from '$lib/types';
/**
 * Usage: <div use:clickOutside={(e) => console.log(e)}>
 * Only works with class and children attributes
 *
 * @param { HTMLElement } node Comes from Svelte
 * @param { callback } (event: MouseEvent) => void callback after clickOutside
 */

export function clickOutside(
	node: HTMLElement,
	callback?: (event: MouseEvent) => void
): ActionReturnType {
	const handleClick = (event) => {
		if (node && node !== event.target && !node.contains(event.target) && !event.defaultPrevented) {
			if (callback) {
				callback(event);
			}
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
