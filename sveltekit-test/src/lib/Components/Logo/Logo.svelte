<script lang="ts">
	export let width = 40;
	export let height = 40;

	export let animated = false;

	let c = '';
	export { c as class };

	import { spring } from 'svelte/motion';
	import { mapToRange } from '$utils';

	let angle = spring(0, {
		stiffness: 0.1,
		damping: 0.25
	});

	const handleClick = ({ clientX }: MouseEvent) => {
		if (animated) {
			const computed = mapToRange(clientX, 0, window.innerWidth, 45, -45);
			$angle = computed;
		}
	};

	const handleMouse = ({ clientX }: MouseEvent) => {
		if (animated) {
			const computed = mapToRange(clientX, 0, window.innerWidth, 45, -45);
			$angle = computed;
		}
	};

	const handleTouch = ({ touches }: TouchEvent) => {
		if (animated && touches[0]) {
			const computed = mapToRange(touches[0].pageX, 0, window.innerWidth, 45, -45);
			$angle = computed;
		}
	};
</script>

<svelte:window on:click={handleClick} on:mousemove={handleMouse} on:touchmove={handleTouch} />

<svg
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	version="1.1"
	x="0px"
	y="0px"
	width={`${width}px`}
	height={`${height}px`}
	viewBox="0 0 40 40"
	xml:space="preserve"
	style="transform: rotate({$angle}deg)"
	class={c}
>
	<circle fill="white" cx="20" cy="20" r="19" />
	<circle fill="currentColor" cx="12" cy="14" r="2" />
	<circle fill="currentColor" cx="28" cy="14" r="2" />
	<circle fill="currentColor" cx="12" cy="20" r="2" />
	<circle fill="currentColor" cx="28" cy="20" r="2" />
	<path
		fill="currentColor"
		d="M20,32c-6.3,0-10.5-4.1-10.7-4.3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0c0,0,3.8,3.7,9.3,3.7s9.3-3.7,9.3-3.7         c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4C30.5,27.9,26.3,32,20,32z"
	/>
	<path
		fill="currentColor"
		d="M20,0C9,0,0,9,0,20s9,20,20,20s20-9,20-20S31,0,20,0z M20,38c-9.9,0-18-8.1-18-18S10.1,2,20,2s18,8.1,18,18         S29.9,38,20,38z"
	/>
</svg>
