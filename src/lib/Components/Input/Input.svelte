<script lang="ts">
	import type { Colors } from '$utils/colors';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { INPUT_COLOR_CLASSES } from './constants';

	interface $$Props extends HTMLInputAttributes {
		value: string;
		errors: string[] | undefined;
		tainted: boolean;

		label: string;
		id: string;

		variant?: Colors;
	}

	export let value: string;
	export let errors: string[] | undefined = undefined;
	export let tainted: boolean;

	export let id: string;

	export let label: string;
	export let variant: Colors = 'default';

	$: state =
		value && ((Array.isArray(errors) && errors.length === 0) || tainted)
			? 'valid'
			: Array.isArray(errors) && errors.length > 0
			? 'invalid'
			: 'default';
</script>

<div class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs">
	<label
		data-state={state}
		for={id}
		class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {INPUT_COLOR_CLASSES[
			variant
		].highlight}"
	>
		{label}
	</label>
	<input
		data-state={state}
		class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 {INPUT_COLOR_CLASSES[
			variant
		].gradient}"
		bind:value
		aria-invalid={errors ? 'true' : undefined}
		{...$$restProps}
	/>

	<p class="h-4 text-xs">
		{#if state === 'invalid' && errors}
			{errors[0]}
		{/if}
	</p>
</div>
