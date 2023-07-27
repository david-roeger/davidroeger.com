<script lang="ts">
	import { Headline } from '$components/Headline';
	import type { ComponentType } from 'svelte';

	export let subline: [string, string];
	export let children: [
		ComponentType | undefined,
		ComponentType | undefined,
		ComponentType | undefined
	] = [undefined, undefined, undefined];
</script>

<div class="flex items-center w-full pt-2 pl-2 text-xs space-x-1 text-mauve-11">
	<div>
		<slot name="preline" />
	</div>
	<p class="truncate">{subline[0]}</p>
</div>
<div class="flex w-full pl-2 space-x-1">
	<slot name="headline" />

	<Headline
		as="h3"
		type="tertiary"
		containerClass="pt-0 px-0 pb-2 truncate border-b-0 md:pb-0"
		class="truncate"
	>
		<slot />
	</Headline>
</div>
<div
	class="hidden w-full pb-2 pl-2 text-xs md:flex md:items-center md:space-x-1 text-mauve-11"
>
	{#if children[1]}
		<svelte:component this={children[1]} />
	{/if}
	<div>
		<slot name="subline" />
	</div>
	<p class="truncate">{subline[1]}</p>
</div>
