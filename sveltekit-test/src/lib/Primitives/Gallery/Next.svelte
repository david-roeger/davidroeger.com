<script lang="ts">
	export let disabled = false;

	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import { derived } from 'svelte/store';
	import type { RootContext } from './types';

	const { setGallery, computedStep, end, id }: RootContext = getContext('root');
	const dataState = derived(end, ($end) => ($end ? 'inactive' : 'active'));

	const handleClick = () => {
		if ($setGallery && !isNaN($computedStep) && !$end) $setGallery($computedStep);
	};
</script>

{#if $end === false}
	<button
		on:click={handleClick}
		on:click
		type="button"
		role="button"
		aria-roledescription={'galerycontrol'}
		aria-controls={`${id}-content`}
		id={`${id}-trigger-next`}
		data-state={$dataState}
		class={c}
		{disabled}
		aria-disabled={disabled}
	>
		<slot />
	</button>
{/if}
