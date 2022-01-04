<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let subline: [string, string];
	//export let children: [SvelteComponent | undefined, SvelteComponent | undefined, SvelteComponent?];
	let children = [undefined, undefined, undefined];
</script>

<div class="flex items-center w-full space-x-1 text-xs text-mauve-11">
	<slot name="preline" />
	<p>{subline[0]}</p>
</div>
<div class="flex items-center w-full md:ml:0">
	<h3 class="text-xl truncate"><slot /></h3>
	<slot name="headline" />
</div>
<div class="hidden w-full text-xs md:flex md:items-center md:space-x-1 text-mauve-11">
	{#if children[1]}
		<svelte:component this={children[1]} />
	{/if}
	<slot name="subline" />
	<p class="truncate">{subline[1]}</p>
</div>
