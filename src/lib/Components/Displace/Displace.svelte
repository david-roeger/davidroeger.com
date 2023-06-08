<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	interface $$Props extends HTMLAttributes<any> {
		text: string;
		replacer?: string;
		split?: boolean;
		class?: string;
		style?: string;
	}

	let c = '';
	export { c as class };
	export let style = '';

	export let text: string = '';
	export let replacer: string = '_';
	export let split: boolean = true;

	const fixed = text.replaceAll(' ', replacer);
	const charArray = split ? [...fixed] : [fixed];

	export let as: string = 'span';
</script>

<svelte:element
	this={as}
	style="position: relative; {style}"
	class="displace word {c}"
	{...$$restProps}
>
	{#each charArray as char}
		<span class="char-wrapper" data-char={char}>
			<span class="char">
				{char}
			</span>
		</span>
	{/each}
</svelte:element>
