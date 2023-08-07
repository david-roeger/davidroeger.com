import type { ActionReturnType } from '$types';

export const preload = (
	node: HTMLButtonElement | HTMLElement,
	options?: {
		strategy?: 'tap' | 'move' | 'focus' | 'all';
		staleTime?: number;
	}
): ActionReturnType => {
	const { strategy = 'all', staleTime = 5000 } = options ?? {};
	let moveTimeout: NodeJS.Timeout;
	let lastDispatch = -1;

	function dispatch(type: 'tap' | 'move' | 'focus') {
		const now = Date.now();

		if (lastDispatch === -1 || now - lastDispatch > staleTime) {
			if ('disabled' in node && node.disabled) {
				return;
			}
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

		dispatch('tap');
	}

	function focus(event: Event) {
		const target = event.target as Node;
		// check if target is node or child of node
		if (!target) {
			return;
		}

		dispatch('focus');
	}

	function update() {
		lastDispatch = -1;
		if (strategy === 'all' || strategy === 'move') {
			document.addEventListener('mousemove', move);
		}
		if (strategy === 'all' || strategy === 'tap') {
			document.addEventListener('mousedown', tap);
			document.addEventListener('touchstart', tap, { passive: true });
		}

		if (strategy === 'all' || strategy === 'focus') {
			node.addEventListener('focus', focus);
		}
	}
	function destroy() {
		document.removeEventListener('mousemove', move);
		document.removeEventListener('mousedown', tap);
		document.removeEventListener('touchstart', tap);
		node.removeEventListener('focus', focus);
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
