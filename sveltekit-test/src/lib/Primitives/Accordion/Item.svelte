<!--
    Prop
Type
Default
asChild	boolean	false
disabled	boolean	false
value*
-->
<script lang="ts">
	export let value: string;
	export let disabled: boolean = false;

	let c = '';
	export { c as class };
	/*
        set data state
    */
	import { setContext, getContext } from 'svelte';
	import type { ItemContext, RootContext } from './types';
	import { derived } from 'svelte/store';

	const { activeValues, id, ...root }: RootContext = getContext('root');

	const active = derived(activeValues, ($activeValues: string[]) => $activeValues.includes(value));
	const dataState = derived(active, ($active) => ($active ? 'open' : 'closed'));

	const itemContext: ItemContext = {
		id: `${id}-${value}`,
		value: value,
		active: active,
		disabled: root.disabled || disabled,
		dataState: dataState
	};
	setContext('item', itemContext);
</script>

<div data-state={$dataState} class={`${c}`}>
	<slot />
</div>
