<script lang="ts">
	let c = '';
	export { c as class };

	export let disabled = false;

	import { getContext, onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import type { RootContext } from './types';

	const { open, setOpen, id, triggerElement }: RootContext =
		getContext('root');
	const dataState = derived(open, ($open) => ($open ? 'open' : 'closed'));

	const handleClick = () => {
		if (!$open && $setOpen) {
			$setOpen();
			return;
		}
	};

	let trigger: HTMLButtonElement;

	export function getReference() {
		return trigger;
	}

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
	type="button"
	{disabled}
	{...$$restProps}
>
	<slot />
</button>
