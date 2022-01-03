<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { ItemContext, RootContext } from './types';

	const { active, dataState, value, ...item }: ItemContext = getContext('item');
	const { setAccordion }: RootContext = getContext('root');

	const handleClick = () => {
		if ($setAccordion) $setAccordion(value, $active);
	};
</script>

<button
	on:click={handleClick}
	on:click
	class={`${c}`}
	id={`${item.id}-trigger`}
	aria-controls={`${item.id}-content`}
	aria-expanded={$active}
	data-state={$dataState}
	disabled={item.disabled}
	aria-disabled={item.disabled}
>
	<slot />
</button>
