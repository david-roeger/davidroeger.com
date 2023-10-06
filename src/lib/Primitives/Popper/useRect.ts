import { observeElementRect } from './observeElementRect';

import type { Measurable } from './observeElementRect';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Rect } from './types';

function getScrollParent(node: HTMLElement) {
	if (node.scrollHeight > node.clientHeight) {
		return node;
	} else if (node.parentElement) {
		return getScrollParent(node.parentElement);
	} else {
		return undefined;
	}
}

/**
 * Use this custom hook to get access to an element's rect (getBoundingClientRect)
 * and observe it along time.
 */
function useRect(measurable: Measurable | null): Writable<Rect> {
	const rect = writable<Rect>();

	let onDestroy: () => void;
	if (measurable) {
		onDestroy = observeElementRect(measurable, (r) => {
			const scrollParent = getScrollParent(measurable as HTMLElement);
			rect.set({
				rect: r,
				offset: {
					x: scrollParent ? scrollParent.scrollLeft : window.scrollX,
					y: scrollParent ? scrollParent.scrollTop : window.scrollY
				},
				onDestroy
			});
		});
		rect.set({
			rect: measurable.getBoundingClientRect(),
			offset: {
				x: measurable.offsetLeft,
				y: measurable.offsetTop
			},
			onDestroy
		});

		/*return () => {
				setRect(undefined);
				unobserve();
			};*/

		// handle destroy
	}
	return rect;
}

export { useRect };
