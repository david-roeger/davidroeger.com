<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext, onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import type { RootContext } from './types';

	const { open, setOpen, setClose, id, triggerElement }: RootContext = getContext('root');
	const dataState = derived(open, ($open) => ($open ? 'open' : 'closed'));

	const handleClick = () => {
		if (!$open && $setOpen) {
			$setOpen();
			return;
		}
		if ($setClose) $setClose();
	};

	let trigger: HTMLButtonElement;
	onMount(() => {
		$triggerElement = trigger;
	});
</script>

<button
	bind:this={trigger}
	on:click={handleClick}
	on:click
	aria-haspopup="dialog"
	data-state={$dataState}
	aria-expanded={$open}
	aria-controls="{id}-content"
	class={c}
>
	<slot />
</button>
