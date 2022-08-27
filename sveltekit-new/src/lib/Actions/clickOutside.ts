import type { ActionReturnType } from '$lib/types';

export function clickOutside(
	node: HTMLElement,
	callback?: (event: MouseEvent) => void
): ActionReturnType {
	const handleClick = (event: MouseEvent) => {
		const { target } = event;
		if (
			node &&
			node !== event.target &&
			!node.contains(target as Node) &&
			!event.defaultPrevented
		) {
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
