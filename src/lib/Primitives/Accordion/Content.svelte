<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { ItemContext } from './types';

	const { active, dataState, ...item }: ItemContext = getContext('item');
</script>

<div
	class={c}
	id={`${item.id}-content`}
	aria-labelledby={`${item.id}-trigger`}
	data-state={$dataState}
	role="region"
	hidden={!$active}
>
	<slot />
</div>
