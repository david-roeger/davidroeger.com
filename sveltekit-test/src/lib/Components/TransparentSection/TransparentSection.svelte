<script lang="ts">
	export let asTag = 'div';
	let c = '';
	export { c as class };
</script>

<svelte:element this={asTag} class="border-b border-mauve-6 bg-white/[0.85] {c}">
	<slot />
</svelte:element>
