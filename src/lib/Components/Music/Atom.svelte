<script lang="ts">
	let c = '';
	export { c as class };
</script>

{#if c}
	<div class={c}><slot /></div>
{:else}
	<slot />
{/if}
