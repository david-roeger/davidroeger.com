<script lang="ts">
	export let value: string;
	export let disabled = false;

	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import { derived } from 'svelte/store';
	import type { RootContext } from './types';

	const { setTabs, activeValue, id }: RootContext = getContext('root');
	const active = derived(
		activeValue,
		($activeValue) => $activeValue === value,
	);
	const dataState = derived(active, ($active) =>
		$active ? 'active' : 'inactive',
	);

	const handleClick = () => {
		if ($setTabs) $setTabs(value);
	};
</script>

<button
	on:click={handleClick}
	on:click
	type="button"
	role="tab"
	aria-selected={$active}
	aria-controls="{id}-content-{value}"
	id="{id}-trigger-{value}"
	data-state={$dataState}
	class={c}
	aria-expanded={$active}
	tabindex={$active ? 0 : -1}
	{disabled}
	aria-disabled={disabled}
>
	<slot />
</button>
