<script lang="ts">
	export let as = 'li';
	let c = '';
	export { c as class };
</script>

<svelte:element this={as} class="border-b last:border-b-0 border-mauve-6 {c}">
	<slot />
</svelte:element>
