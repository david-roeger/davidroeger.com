import { tick } from 'svelte';
import type { ActionReturnType } from '$types';
/**
 * Usage: <div use:portal> or <div use:portal={Element | CSS Selector}>
 *
 * @param { HTMLElement } node Comes from Svelte
 * @param { HTMLElement | string } target Portal Container (DOM Element or CSS Selector)
 */

export const portal = (
	node: HTMLElement,
	target: HTMLElement | string = '#portal'
): ActionReturnType => {
	let targetEl: HTMLElement | null;
	async function update(newTarget: HTMLElement | string) {
		if (typeof newTarget === 'string') {
			targetEl = document.querySelector(newTarget);
			if (targetEl === null) {
				await tick();
				targetEl = document.querySelector(newTarget);
			}
			if (targetEl === null && newTarget === '#portal') {
				let portal = document.getElementById('#portal');
				if (!portal) {
					portal = document.createElement('section');
					portal.style.position = 'absolute';
					portal.style.zIndex = '99999';
					portal.id = 'portal';
					document.body.appendChild(portal);
				}
				targetEl = portal;
			}
			if (targetEl === null) {
				throw new Error(
					`No element found matching css selector: "${target}"`
				);
			}
		} else if (target instanceof HTMLElement) {
			targetEl = newTarget;
		} else {
			throw new TypeError(
				`Unknown portal target type: ${
					target === null ? 'null' : typeof target
				}. Allowed types: string (CSS selector) or HTMLElement.`
			);
		}

		if (targetEl.contains(node)) {
			return;
		}

		targetEl.appendChild(node);
	}
	function destroy() {
		if (node?.parentElement) {
			node.parentElement.removeChild(node);
		}
	}
	update(target);

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
