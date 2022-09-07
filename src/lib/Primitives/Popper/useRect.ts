import { observeElementRect } from './observeElementRect';

import type { Measurable } from './observeElementRect';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
/**
 * Use this custom hook to get access to an element's rect (getBoundingClientRect)
 * and observe it along time.
 */
function useRect(
	measurable: Measurable | null,
): Writable<{ rect: DOMRect; onDestroy: () => void }> {
	const rect = writable<{ rect: DOMRect; onDestroy: () => void }>();

	let onDestroy;
	if (measurable) {
		rect.set({ rect: measurable.getBoundingClientRect(), onDestroy });
		onDestroy = observeElementRect(measurable, (r) =>
			rect.set({ rect: r, onDestroy }),
		);

		/*return () => {
				setRect(undefined);
				unobserve();
			};*/

		// handle destroy
	}
	return rect;
}

export { useRect };
