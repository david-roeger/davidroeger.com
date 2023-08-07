<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let defaultOpen: boolean;

	let c = '';
	export { c as class };

	import { activeDialogs } from './store';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';
	import { debounce } from '$utils';

	id++;
	const rootContext: RootContext = {
		id: `drds-dialog-${id.toString()}`,
		trap: writable(undefined),
		open: writable(defaultOpen),
		setOpen: writable(undefined),
		setClose: writable(undefined),
		computedId: id
	};
	setContext('root', rootContext);
	const { open, trap, setOpen, setClose, computedId } = rootContext;
	export { setClose };

	$setOpen = () => {
		$activeDialogs = [...$activeDialogs, computedId];
		if ($activeDialogs.length === 1) {
			const topOffset = document.documentElement.scrollTop;
			document.body.style.setProperty('--topOffset', -topOffset + 'px');
			document.body.classList.add('dialog-open');
		}

		$open = true;
	};

	onMount(() => {
		if (defaultOpen && $setOpen) {
			$setOpen();
		}
	});

	$setClose = () => {
		if ($trap) {
			$trap.deactivate();
			$trap = undefined;
		}

		$activeDialogs = [
			...$activeDialogs.filter(
				(activeDialog) => activeDialog !== computedId
			)
		];

		if ($activeDialogs.length === 0) {
			document.body.classList.remove('dialog-open');
			window.scrollTo({
				top: -parseInt(
					document.body.style.getPropertyValue('--topOffset')
				)
			});
		}
		$open = false;
	};

	const dispatch = createEventDispatcher<{ openChange: { open: boolean } }>();
	$: dispatch('openChange', {
		open: $open
	});

	onDestroy(() => {
		if ($trap) {
			$trap.deactivate();
			$trap = undefined;
		}
	});

	const handleScroll = () => {
		if ($open) {
			const topOffset = document.documentElement.scrollTop;
			document.body.style.setProperty('--topOffset', -topOffset + 'px');
		}
	};
</script>

<svelte:window on:scroll|passive={debounce(handleScroll, 50)} />

<div class={c}>
	<slot />
</div>
