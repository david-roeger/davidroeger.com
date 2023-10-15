<script lang="ts" context="module">
	type Form = Record<string, unknown>;
</script>

<script lang="ts">
	import type { Colors } from '$utils/colors';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { INPUT_COLOR_CLASSES } from './constants';
	import type { Writable } from 'svelte/store';
	import type { InputConstraint } from 'sveltekit-superforms';
	import Input from './Input.svelte';

	interface $$Props extends HTMLInputAttributes {
		id: string;
		name: string;

		formStore: Writable<Record<string, string>>;
		errorsStore: Writable<Record<string, string[] | undefined>>;
		taintedStore: Writable<Record<string, boolean | undefined> | undefined>;
		constraintsStore: Writable<Record<string, InputConstraint>>;

		variant?: Colors;
		label: string;
	}

	export let id: string;
	export let name: string;

	export let formStore: Writable<Record<string, string>>;
	export let errorsStore: Writable<Record<string, string[] | undefined>>;
	export let taintedStore: Writable<
		Record<string, boolean | undefined> | undefined
	>;
	export let constraintsStore: Writable<Record<string, InputConstraint>>;

	export let variant: Colors = 'default';
	export let label: string;
</script>

<Input
	{id}
	{name}
	{label}
	bind:value={$formStore[name]}
	errors={name in $errorsStore ? $errorsStore[name] ?? [] : undefined}
	tainted={$taintedStore && $taintedStore[name] ? true : false}
	{variant}
	{...$constraintsStore[name]}
	{...$$restProps}
/>
