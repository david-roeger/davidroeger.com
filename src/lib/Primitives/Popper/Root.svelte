<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let defaultOpen: boolean;

	let c = '';
	export { c as class };

	import { setContext, createEventDispatcher, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import type { RootContext } from './types';

	id++;
	const rootContext: RootContext = {
		id: `drds-popper-${id.toString()}`,
		trap: writable(undefined),
		open: writable(defaultOpen),
		setOpen: writable(undefined),
		setClose: writable(undefined),
		triggerElement: writable(undefined)
	};

	setContext('root', rootContext);
	const { open, trap, setOpen, setClose } = rootContext;

	export const closePopper = setClose;

	$setOpen = () => {
		$open = true;
	};

	const destroy = () => {
		if ($trap) {
			$trap.deactivate();
			$trap = undefined;
		}
	};

	onDestroy(() => {
		destroy();
	});

	/* outside click && esc */
	$setClose = () => {
		destroy();
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
