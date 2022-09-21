import { observeElementRect } from './observeElementRect';

import type { Measurable } from './observeElementRect';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Rect } from './types';

/**
 * Use this custom hook to get access to an element's rect (getBoundingClientRect)
 * and observe it along time.
 */
function useRect(measurable: Measurable | null): Writable<Rect> {
	const rect = writable<Rect>();

	let onDestroy: () => void;
	if (measurable) {
		onDestroy = observeElementRect(measurable, (r) =>
			rect.set({ rect: r, onDestroy })
		);
		rect.set({ rect: measurable.getBoundingClientRect(), onDestroy });

		/*return () => {
				setRect(undefined);
				unobserve();
			};*/

		// handle destroy
	}
	return rect;
}

export { useRect };
