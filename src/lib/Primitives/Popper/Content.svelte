<script lang="ts">
	import { getContext, onMount, tick } from 'svelte';
	import { derived } from 'svelte/store';
	import { createFocusTrap, type Options } from 'focus-trap';
	import { clickOutside } from '$actions';

	export let focusTrapOptions: Options = {};

	import type { Side, Align, RootContext } from './types';

	export let side: Side;
	export let align: Align;
	export let sideOffset = 0;
	export let alignOffset = 0;
	export let collisionTolerance = 0;
	export let avoidCollision = true;

	let c = '';
	export { c as class };

	const {
		open,
		id,
		trap,
		setClose,
		contentElement,
		popperOptions,
		contentStyles
	}: RootContext = getContext('root');

	const dataState = derived(open, ($open) => ($open ? 'open' : 'closed'));

	let content: HTMLElement;
	let mounted = false;
	$: activateTrap($open);

	const activateTrap = async (state: boolean) => {
		if (state && !$trap && mounted) {
			await tick();
			$trap = createFocusTrap(content, {
				allowOutsideClick: true,
				escapeDeactivates: false,
				fallbackFocus: content,
				...focusTrapOptions
			});
			$trap.activate();
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if ($setClose) $setClose();
			e.preventDefault();
			e.stopPropagation();
		}
	};

	onMount(() => {
		mounted = true;
		activateTrap($open);

		$contentElement = content;
		const options = {
			side,
			sideOffset,
			align,
			alignOffset,
			shouldAvoidCollisions: avoidCollision,
			collisionBoundariesRect: DOMRect.fromRect({
				width: window.innerWidth,
				height: window.innerHeight,
				x: 0,
				y: 0
			}),
			collisionTolerance
		};

		$popperOptions = options;
	});
</script>

<div
	style={`position: absolute; visibility: ${
		$open ? 'visible' : 'hidden'
	}; opacity: ${$open ? 1 : 0}; ${$contentStyles}`}
	data-state={$dataState}
	role="dialog"
	aria-modal="true"
	id="{id}-content"
	aria-labelledby="{id}-title"
	aria-describedby="{id}-description"
	class={c}
	tabindex="-1"
	bind:this={content}
	on:keydown
	on:keydown={handleKeyDown}
	aria-hidden={!$open}
	use:clickOutside={() => {
		if ($setClose && $open) $setClose();
	}}
>
	<slot />
</div>
