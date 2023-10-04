<script lang="ts">
	import { slide, reversedEasing } from './utils';

	let c = '';
	export { c as class };

	export let as = 'div';

	export let key: unknown;
	export let direction: 1 | -1 = 1;
</script>

<svelte:element
	this={as}
	class="grid grid-cols-1 grid-rows-1 overflow-x-hidden {c}"
>
	{#key key}
		<div
			in:slide={{
				start: direction === 1 ? 100 : -100,
				end: 0,
				duration: 1000
			}}
			out:slide={{
				start: direction === 1 ? -100 : 100,
				end: 0,
				duration: 1000,
				easing: reversedEasing
			}}
			class="col-start-1 row-start-1 w-full"
			on:introstart
			on:introend
		>
			<slot />
		</div>
	{/key}
</svelte:element>
