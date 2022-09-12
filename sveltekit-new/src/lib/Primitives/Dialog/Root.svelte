<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let defaultOpen: boolean;

	let c = '';
	export { c as class };

	import { activeDialogs } from './store';
	import { onDestroy, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';

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
	$setOpen = () => {
		$activeDialogs = [...$activeDialogs, computedId];
		document.body.classList.add('dialog-open');

		$open = true;
	};
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
</script>

<div class={c}>
	<slot />
</div>
