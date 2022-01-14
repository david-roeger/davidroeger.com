<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let defaultOpen: boolean;

	let c = '';
	export { c as class };

	import { setContext, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import type { RootContext } from './types';
	import { clickOutside } from '$lib/Actions';

	import { createPopper } from '@popperjs/core';

	id++;
	const rootContext: RootContext = {
		id: `drds-popper-${id.toString()}`,
		trap: writable(undefined),
		open: writable(defaultOpen),
		setOpen: writable(undefined),
		setClose: writable(undefined),
		popperOptions: writable(undefined),
		triggerElement: writable(undefined),
		contentElement: writable(undefined)
	};

	setContext('root', rootContext);
	const { open, trap, setOpen, setClose, popperOptions, triggerElement, contentElement } =
		rootContext;

	$setOpen = () => {
		$open = true;
	};

	let popper;
	$: {
		if (!popper) {
			if ($triggerElement && $contentElement) {
				popper = createPopper($triggerElement, $contentElement, $popperOptions ?? {});
			}
		} else if ($triggerElement && $contentElement) {
			popper.destroy();
			popper = createPopper($triggerElement, $contentElement, $popperOptions ?? {});
		}
	}

	/* outside click && esc */
	$setClose = () => {
		if ($trap) {
			$trap.deactivate();
			$trap = undefined;
		}

		popper.destroy();
		popper = undefined;
		$open = false;
		console.log();
	};

	const dispatch = createEventDispatcher<{ openChange: { open: boolean } }>();
	$: dispatch('openChange', {
		open: $open
	});
</script>

<div
	class={c}
	use:clickOutside={() => {
		if ($setClose) $setClose();
	}}
>
	<slot />
</div>
