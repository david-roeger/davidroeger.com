<script lang="ts">
	let c = '';
	export { c as class };

	export let as: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' = 'H3';
</script>

<svelte:element this={as} class={c}>
	<slot />
</svelte:element>
