<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let defaultValue: string | string[];
	export let direction: 'horizontal' | 'vertical' = 'horizontal';

	let c = '';
	export { c as class };

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';

	id++;
	const computedId = `drds-tags-${id.toString()}`;
	const rootContext: RootContext = {
		id: computedId,
		activeValues: writable(Array.isArray(defaultValue) ? defaultValue : [defaultValue]),
		setTags: writable(undefined),
		unsetTags: writable(undefined)
	};
	setContext('root', rootContext);
	const { activeValues, setTags, unsetTags } = rootContext;

	$setTags = (value: string) => {
		if (!$activeValues.includes(value)) {
			$activeValues = [...$activeValues, value];
			return;
		}
		$activeValues = $activeValues.filter((activeValue) => activeValue !== value);
	};

	$unsetTags = () => {
		$activeValues = [];
	};

	const dispatch = createEventDispatcher<{ valueChange: { value: string[] } }>();
	$: dispatch('valueChange', {
		value: $activeValues
	});
</script>

<div
	aria-roledescription={'tagcontainer'}
	data-orientation={direction}
	id={`${computedId}-list`}
	class={`${c}`}
>
	<slot />
</div>
