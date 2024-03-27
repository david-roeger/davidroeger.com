<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';

	export let type: 'tween' | 'spring';
	const instant = { duration: 0 };
	const transition = { duration: 300 };

	const animation = type === 'tween' ? tweened : spring;

	let x = animation(0, {
		easing: cubicInOut
	});
	let defaultX = 0;

	let y = animation(0, {
		easing: cubicInOut
	});
	let defaultY = 0;

	export { defaultX as x, defaultY as y };

	onMount(() => {
		x.set(defaultX, instant);
		y.set(defaultY, instant);
	});

	$: x.set(defaultX, {
		easing: cubicInOut,
		...transition
	});

	$: y.set(defaultY, {
		easing: cubicInOut,
		...transition
	});
</script>

<div
	class="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-9"
	style="left: {$x}px; top:{$y}px;"
/>
