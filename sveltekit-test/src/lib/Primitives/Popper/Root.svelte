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

	import { createPopper } from '@popperjs/core';

	id++;
	const rootContext: RootContext = {
		id: `drds-popper-${id.toString()}`,
		trap: writable(undefined),
		open: writable(defaultOpen),
		setOpen: writable(undefined),
		setClose: writable(undefined),
		triggerElement: writable(undefined),
		contentElement: writable(undefined)
	};

	setContext('root', rootContext);
	const { open, trap, setOpen, setClose, triggerElement, contentElement } = rootContext;

	$setOpen = () => {
		$open = true;
	};

	let popper;
	$: {
		if (!popper) {
			if ($triggerElement && $contentElement) {
				console.log($triggerElement);
				console.log($contentElement);
				popper = createPopper($triggerElement, $contentElement);
			}
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
	};

	const dispatch = createEventDispatcher<{ openChange: { open: boolean } }>();
	$: dispatch('openChange', {
		open: $open
	});
</script>

<div class={c}>
	<slot />
</div>
