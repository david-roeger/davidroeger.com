<script lang="ts">
	export let min: number;
	export let max: number;
	export let value: number;
	export let getValueLabel:
		| ((value: number, max: number) => string)
		| undefined = undefined;

	let c = '';
	export { c as class };

	import { setContext } from 'svelte';
	import type { RootContext } from './types';
	import { limit } from '$utils';
	import { writable } from 'svelte/store';

	const valuePercentage = (value: number, min: number, max: number) => {
		return (
			((limit(value, min, max) - min - min) /
				limit(max - min, min, max)) *
			100
		);
	};
	const rootContext: RootContext = {
		min: min,
		max: max,
		value: writable(valuePercentage(value, min, max))
	};
	setContext('root', rootContext);

	const { value: valueStore } = rootContext;

	$: $valueStore = valuePercentage(value, min, max);
</script>

<div
	class={c}
	role="progressbar"
	aria-valuemin={min}
	data-valuemax={max}
	data-valuenow={value}
	aria-valuetext={getValueLabel ? getValueLabel(value, max) : undefined}
	data-min={min}
	data-max={max}
	data-value={value}
	style="display: flex;"
>
	<slot />
</div>
