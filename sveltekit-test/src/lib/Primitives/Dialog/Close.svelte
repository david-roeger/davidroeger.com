<script lang="ts">
	let c = '';
	export { c as class };
	let t = '';
	export { t as type };
	import { getContext, onMount } from 'svelte';
	import type { RootContext } from './types';
	import { hasParentOfType } from '$utils';
	import { buttonType } from '$actions';

	const { setClose }: RootContext = getContext('root');

	let close: HTMLButtonElement;
	onMount(() => {
		if (t) {
			close.type = t;
			return;
		}
		if (hasParentOfType(close, 'form')) {
			close.type = 'button';
		}
	});
</script>

<button
	on:click
	on:click={() => {
		if ($setClose) $setClose();
	}}
	class={`${c}`}
	bind:this={close}
	use:buttonType={t}
>
	<slot />
</button>
