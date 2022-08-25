<script lang="ts">
	import { onMount } from 'svelte';
	import BezierEasing from 'bezier-easing';
	import { mapToRange } from '$lib/Utils';

	export let disabled = false;

	let c = '';
	export { c as class };

	let show = false;
	const handleScroll = () => {
		if (
			(document.body.scrollTop > 120 ||
				document.documentElement.scrollTop > 120) &&
			document.body.offsetHeight > window.innerHeight
		) {
			show = true;
			return;
		}
		show = false;
	};
	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll();
	});

	const handleClick = () => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	const baseEasing = BezierEasing(0.4, 0, 0.2, 1);
	const reversedEasing = BezierEasing(0.8, 0, 0.6, 1);
	function slideUp(
		_: HTMLButtonElement,
		{ start = -42, end = 0, duration = 150, easing = baseEasing },
	) {
		return {
			duration,
			css: (t: number) => {
				const eased = easing(t);
				const mapped = mapToRange(eased, 0, 1, start, end);
				return `bottom: ${mapped}px;`;
			},
		};
	}
</script>

{#if show}
	<button
		in:slideUp|local
		out:slideUp|local={{ easing: reversedEasing }}
		on:click={handleClick}
		on:click
		type="button"
		{disabled}
		aria-disabled={disabled}
		class={`fixed bottom-0 left-0 block p-1 m-2 text-xs bg-white border rounded-full cursor-n-resize touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1 ${c}`}
	>
		<slot />
	</button>
{/if}
