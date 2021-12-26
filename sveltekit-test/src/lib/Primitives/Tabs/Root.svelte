<script lang="ts">
	export let defaultValue: string;
	export let id: string;

	export let direction: 'horizontal' | 'vertical' = 'horizontal';
	export let activationMode: 'automatic' | 'manual' = 'automatic';

	let c = '';
	export { c as class };

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';

	const rootContext: RootContext = {
		id: `tabs-${id}`,
		activationMode: activationMode,
		direction: direction,
		activeValue: writable(defaultValue),
		setTabs: writable(undefined)
	};
	setContext('root', rootContext);
	const { activeValue, setTabs } = rootContext;

	$setTabs = (value: string) => {
		if ($activeValue !== value) {
			$activeValue = value;
		}
	};

	const dispatch = createEventDispatcher<{ valueChange: { value: string } }>();
	$: dispatch('valueChange', {
		value: $activeValue
	});
</script>

<div data-orientation={direction} class={`${c}`}>
	<slot />
</div>
