<script lang="ts">
	import { onMount } from 'svelte';

	export let disabled = false;

	let c = '';
	export { c as class };

	let show = false;
	onMount(() => {
		window.addEventListener('scroll', () => {
			if (
				document.body.scrollTop > 120 ||
				document.documentElement.scrollTop > 120
			) {
				show = true;
				return;
			}
			show = false;
		});
	});

	const handleClick = () => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};
</script>

{#if show}
	<button
		on:click={handleClick}
		on:click
		type="button"
		{disabled}
		aria-disabled={disabled}
		class={c}
	>
		<slot />
	</button>
{/if}
