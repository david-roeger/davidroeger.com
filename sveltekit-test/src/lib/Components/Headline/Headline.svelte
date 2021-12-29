<script lang="ts">
	export let type: 'primary' | 'secondary' = 'primary';
	let c = '';
	export { c as class };
</script>

<div class={`border-b p-2 ${c}`}>
	{#if type === 'secondary'}
		<h2 class="text-4xl">
			<slot />
		</h2>
	{:else}
		<h1 class="text-6xl">
			<slot />
		</h1>
	{/if}
</div>
