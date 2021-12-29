<script lang="ts">
	import { onMount } from 'svelte';

	let root: HTMLDivElement;
	let inner: HTMLDivElement;
	onMount(() => {});
</script>

<div bind:this={root}>
	<slot />
</div>
