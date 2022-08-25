<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { RootContext } from './types';

	const { open, setClose }: RootContext = getContext('root');

	const handleClick = () => {
		if ($setClose) $setClose();
	};
</script>

{#if $open}
	<div
		class={c}
		style="pointer-events: auto;"
		on:click|self
		on:click|self={handleClick}
	>
		<slot />
	</div>
{/if}
