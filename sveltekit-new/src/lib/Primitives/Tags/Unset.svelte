<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import { derived } from 'svelte/store';
	import type { RootContext } from './types';

	const { unsetTags, activeValues, id }: RootContext = getContext('root');
	const dataState = derived(activeValues, ($activeValues) =>
		$activeValues.length ? 'active' : 'inactive'
	);

	const handleClick = () => {
		if ($unsetTags) $unsetTags();
	};
</script>

<button
	on:click={handleClick}
	on:click
	type="button"
	role="option"
	aria-selected="false"
	aria-controls="{id}-list"
	data-state={$dataState}
	class={c}
>
	<slot />
</button>
