<script lang="ts">
	let c = '';
	export { c as class };
	export let disabled = false;

	import { getContext } from 'svelte';
	import { derived } from 'svelte/store';
	import type { RootContext } from './types';

	const { open, setOpen, id }: RootContext = getContext('root');
	const dataState = derived(open, ($open) => ($open ? 'open' : 'closed'));

	const handleClick = () => {
		if ($setOpen) $setOpen();
	};
</script>

<button
	on:click
	on:click={handleClick}
	aria-haspopup="dialog"
	data-state={$dataState}
	aria-expanded={$open}
	aria-controls="{id}-content"
	class={c}
	disabled={disabled ? true : undefined}
	{...$$restProps}
>
	<slot />
</button>
