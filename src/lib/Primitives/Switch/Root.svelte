<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let defaultChecked = false;

	let checkedValue = defaultChecked;
	export { checkedValue as checked };

	export let htmlId: string | undefined = undefined;
	export { htmlId as id };
	export let disabled = false;
	export let required = false;
	export let name: string | undefined = undefined;
	export let value = 'on';

	let c = '';
	export { c as class };

	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';
	import { hasParentOfType } from '$utils';

	id++;

	const rootContext: RootContext = {
		id: htmlId ?? `drds-switch-${id.toString()}`,
		disabled,
		checked: writable<boolean>(defaultChecked || checkedValue || false)
	};

	setContext('root', rootContext);
	const { checked, id: rootId } = rootContext;

	$: $checked = checkedValue;

	const dispatch = createEventDispatcher<{
		checkedChange: { value: boolean };
	}>();

	$: {
		dispatch('checkedChange', {
			value: $checked
		});
	}

	const handleClick = (e: MouseEvent) => {
		if (!disabled) {
			$checked = !$checked;
		}
	};

	let root: HTMLButtonElement;
	let renderInput = false;
	onMount(() => {
		if (hasParentOfType(root, 'form')) {
			renderInput = true;
		}
	});
</script>

<button
	bind:this={root}
	type="button"
	role="switch"
	aria-checked={$checked}
	aria-required={required}
	data-state={$checked ? 'checked' : 'unchecked'}
	data-disabled={disabled ? '' : undefined}
	{disabled}
	{value}
	class={c}
	id={`${rootId}-root`}
	style="position: relative; cursor: pointer;"
	on:click
	on:click={handleClick}
>
	<slot />
</button>

{#if renderInput && name}
	<input
		on:change={() => {
			if (!disabled) {
				$checked = !$checked;
			}
		}}
		id={rootId}
		type="checkbox"
		aria-hidden
		{disabled}
		{name}
		{value}
		checked={$checked ? true : undefined}
		tabindex="-1"
		style="position: absolute; pointer-events: none; opacity: 0;"
	/>
{/if}
