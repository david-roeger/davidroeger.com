<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	const { active }: { active: Readable<boolean> } = getContext('item');
</script>

{#if $active}
	<span class={c}>
		<slot />
	</span>
{/if}
