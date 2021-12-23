<script lang="ts">
	export let defaultOpen: boolean;
	export let id: string;

	let c = '';
	export { c as class };

	import { activeDialogs } from './store';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';

	const rootContext: RootContext = {
		id: `dialog-${id}`,
		trap: writable(undefined),
		open: writable(defaultOpen),
		setOpen: writable(undefined),
		setClose: writable(undefined)
	};
	setContext('root', rootContext);
	const { open, trap, setOpen, setClose } = rootContext;
	$setOpen = () => {
		$activeDialogs = [...$activeDialogs, id];
		console.log($activeDialogs);
		document.body.classList.add('dialog-open');
		$open = true;
	};
	$setClose = () => {
		if ($trap) {
			$trap.deactivate();
			$trap = undefined;
		}
		$activeDialogs = [...$activeDialogs.filter((activeDialog) => activeDialog !== id)];
		console.log($activeDialogs);

		if ($activeDialogs.length === 0) {
			document.body.classList.remove('dialog-open');
		}
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
