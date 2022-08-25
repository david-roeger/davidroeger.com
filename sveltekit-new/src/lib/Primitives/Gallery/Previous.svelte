<script lang="ts">
	export let disabled = false;

	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import { derived } from 'svelte/store';
	import type { RootContext } from './types';

	const { setGallery, computedStep, start, id }: RootContext =
		getContext('root');
	const dataState = derived(start, ($start) =>
		$start ? 'inactive' : 'active',
	);

	const handleClick = () => {
		if ($setGallery && !isNaN($computedStep) && !$start)
			$setGallery(-$computedStep);
	};
</script>

{#if $start === false}
	<button
		on:click={handleClick}
		on:click
		type="button"
		aria-roledescription="galerycontrol"
		aria-controls="{id}-content"
		id="{id}-trigger-next"
		data-state={$dataState}
		class={c}
		{disabled}
		aria-disabled={disabled}
	>
		<slot />
	</button>
{/if}
