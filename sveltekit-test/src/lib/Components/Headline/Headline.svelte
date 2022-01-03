<script lang="ts">
	export let type: 'primary' | 'secondary' | 'tertiary' = 'primary';
	let c = '';
	export { c as class };
</script>

<div class={`border-b border-mauve-6 p-2 ${c}`}>
	{#if type === 'secondary'}
		<h2 class="text-2xl">
			<slot />
		</h2>
	{:else if type === 'tertiary'}
		<h3 class="text-1xl">
			<slot />
		</h3>
	{:else}
		<h1 class="text-6xl">
			<slot />
		</h1>
	{/if}
</div>
