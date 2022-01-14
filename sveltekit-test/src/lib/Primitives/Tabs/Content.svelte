<script lang="ts">
	export let value;
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import { derived } from 'svelte/store';
	import type { RootContext } from './types';

	const { activeValue, id }: RootContext = getContext('root');
	const active = derived(activeValue, ($activeValue) => $activeValue === value);
	const dataState = derived(active, ($active) => ($active ? 'active' : 'inactive'));
</script>

<div
	class={c}
	id="{id}-content-{value}"
	aria-labelledby="{id}-trigger-{value}"
	role="tabpanel"
	data-state={$dataState}
	tabindex="0"
	hidden={!$active}
	aria-hidden={!$active}
>
	<slot />
</div>
