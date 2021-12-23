<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { ItemContext, RootContext } from './types';

	const { active, dataState, ...item }: ItemContext = getContext('item');
	const { activeValues, collapsible, type }: RootContext = getContext('root');

	const handleClick = () => {
		if (type === 'single') {
			if ($active) {
				if (collapsible) $activeValues = [];
				return;
			}
			$activeValues = [item.value];
			return;
		}

		const length = $activeValues.length;
		if ($active) {
			if (length > 1) {
				$activeValues = $activeValues.filter((v) => v !== item.value);
				return;
			}
			if (collapsible) $activeValues = [];
			return;
		}
		$activeValues = [...$activeValues, item.value];
		return;
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
