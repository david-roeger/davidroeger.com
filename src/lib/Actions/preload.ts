import type { ActionReturnType } from '$lib/types';

export const preload = (
	node: HTMLElement,
	options?: {
		strategy?: 'tap' | 'move' | 'both';
		staleTime?: number;
	}
): ActionReturnType => {
	const { strategy = 'both', staleTime = 5000 } = options ?? {};
	let moveTimeout: NodeJS.Timeout;
	let lastDispatch = -1;

	function dispatch(type: 'tap' | 'move') {
		const now = Date.now();

		if (lastDispatch === -1 || now - lastDispatch > staleTime) {
			node.dispatchEvent(new CustomEvent('preload', { detail: type }));
			lastDispatch = now;
		}
	}

	function move(event: MouseEvent) {
		const target = event.target as Node;
		// check if target is node or child of node

		clearTimeout(moveTimeout);

		if (target && node !== target && !node.contains(target)) {
			return;
		}

		moveTimeout = setTimeout(() => {
			dispatch('move');
		}, 20);
	}

	function tap(event: TouchEvent | MouseEvent) {
		const target = event.target as Node;
		// check if target is node or child of node
		if (!target || node !== target || !node.contains(target)) {
			return;
		}
	}

	function update() {
		lastDispatch = -1;
		if (strategy === 'both' || strategy === 'move') {
			document.addEventListener('mousemove', move);
		}
		if (strategy === 'both' || strategy === 'tap') {
			document.addEventListener('mousedown', tap);
			document.addEventListener('touchstart', tap, { passive: true });
		}
	}
	function destroy() {
		document.removeEventListener('mousemove', move);
		document.removeEventListener('mousedown', tap);
		document.removeEventListener('touchstart', tap);
	}

	update();

	return {
		update,
		destroy
	};
};

/*
<script>
  /**
   * DOM Element or CSS Selector
   * @type { HTMLElement|string}
   
  export let target = "body";
</script>

<div use:portal={target} hidden>
  <slot />
</div>
*/
