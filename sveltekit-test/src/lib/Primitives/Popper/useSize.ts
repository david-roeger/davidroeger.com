import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

function useSize(element: HTMLElement | SVGElement | null): Writable<{
	size: { width: number; height: number };
	onDestroy: () => void;
}> {
	const size = writable<{ size: { width: number; height: number }; onDestroy: () => void }>();
	let onDestroy: () => void;
	if (element) {
		const resizeObserver = new ResizeObserver((entries) => {
			if (!Array.isArray(entries)) {
				return;
			}

			// Since we only observe the one element, we don't need to loop over the
			// array
			if (!entries.length) {
				return;
			}

			const rect = element.getBoundingClientRect();
			size.set({ size: { width: rect.width, height: rect.height }, onDestroy });
		});

		onDestroy = () => {
			resizeObserver.unobserve(element);
			size.set(undefined);
		};

		/* set intial size */
		const rect = element.getBoundingClientRect();
		size.set({ size: { width: rect.width, height: rect.height }, onDestroy });

		resizeObserver.observe(element, { box: 'border-box' });
	}

	return size;
}

export { useSize };
