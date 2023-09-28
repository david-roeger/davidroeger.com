<script lang="ts">
	export let width = 40;
	export let height = 40;

	export let animated = false;
	export let container = false;
	export let background = true;
	export let backgroundFill = 'white';
	export let smile = true;

	let c = '';
	export { c as class };

	import { spring } from 'svelte/motion';
	import { mapToRange, limit } from '$utils';

	let angle = spring(0, {
		stiffness: 0.1,
		damping: 0.25
	});

	const handleClick = ({ clientX }: MouseEvent) => {
		if (animated) {
			computeAngle(clientX);
		}
	};

	const handleMouse = ({ clientX }: MouseEvent) => {
		if (animated) {
			computeAngle(clientX);
		}
	};

	const handleTouch = (e: TouchEvent) => {
		if (animated && e.touches[0]) {
			computeAngle(e.touches[0].clientX);
		}
	};

	const computeAngle = (value: number) => {
		const limited = limit(
			window.innerWidth,
			0,
			container ? 1280 : window.innerWidth
		);
		const computed = mapToRange(value, 0, limited, 45, -45);
		$angle = computed;
	};
</script>

<svelte:window
	on:click={handleClick}
	on:mousemove={handleMouse}
	on:touchmove={handleTouch}
	on:touchstart={handleTouch}
	on:touchend={handleTouch}
/>

<svg
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	version="1.1"
	x="0px"
	y="0px"
	width="{width}px"
	height="{height}px"
	viewBox="0 0 40 40"
	xml:space="preserve"
	style="transform: rotate({$angle}deg)"
	class={c}
>
	{#if background}
		<circle fill={backgroundFill} cx="20" cy="20" r="19" />
	{/if}
	<circle fill="currentColor" cx="12" cy="14" r="2" />
	<circle fill="currentColor" cx="28" cy="14" r="2" />
	<circle fill="currentColor" cx="12" cy="20" r="2" />
	<circle fill="currentColor" cx="28" cy="20" r="2" />

	{#if smile}
		<path
			fill="currentColor"
			d="M20,32c-6.3,0-10.5-4.1-10.7-4.3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0c0,0,3.8,3.7,9.3,3.7s9.3-3.7,9.3-3.7         c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4C30.5,27.9,26.3,32,20,32z"
		/>
	{:else}
		<path
			fill="currentColor"
			d="M20 24C26.3 24 30.5 28.1 30.7 28.3C31.1 28.7 31.1 29.3 30.7 29.7C30.3 30.1 29.7 30.1 29.3 29.7C29.3 29.7 25.5 26 20 26C14.5 26 10.7 29.7 10.7 29.7C10.3 30.1 9.7 30.1 9.3 29.7C8.9 29.3 8.9 28.7 9.3 28.3C9.5 28.1 13.7 24 20 24Z"
		/>
	{/if}
	<path
		fill="currentColor"
		d="M20,0C9,0,0,9,0,20s9,20,20,20s20-9,20-20S31,0,20,0z M20,38c-9.9,0-18-8.1-18-18S10.1,2,20,2s18,8.1,18,18         S29.9,38,20,38z"
	/>
</svg>
