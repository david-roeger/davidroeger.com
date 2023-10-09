<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { RootContext } from './types';
	import { ticked } from '$utils/Store/ticked';

	const { open, setClose }: RootContext = getContext('root');

	const tickedDataState = ticked(
		open,
		($open) => ($open ? 'open' : 'closed'),
		$open ? 'open' : 'closed',
		($open) => $open
	);

	const handleClick = () => {
		console.log('handleClick');
		if ($setClose) $setClose();
	};
</script>

{#if $open}
	<div
		data-state={$tickedDataState}
		class={c}
		on:click|self
		on:click|self={handleClick}
		{...$$restProps}
	>
		<slot />
	</div>
{/if}
