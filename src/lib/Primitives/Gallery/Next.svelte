<script lang="ts">
	export let disabled = false;

	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import { derived } from 'svelte/store';
	import type { RootContext } from './types';
	import { ticked } from '$utils/Store/ticked';

	const { setGallery, computedStep, end, id }: RootContext =
		getContext('root');
	const dataState = ticked(
		end,
		($end) => ($end ? 'inactive' : 'active'),
		$end ? 'inactive' : 'active',
		($end) => $end === false
	);

	const handleClick = () => {
		if ($setGallery && !isNaN($computedStep) && !$end)
			$setGallery($computedStep);
	};
</script>

{#if $end === false}
	<button
		on:click={handleClick}
		on:click
		type="button"
		aria-roledescription={'galerycontrol'}
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
