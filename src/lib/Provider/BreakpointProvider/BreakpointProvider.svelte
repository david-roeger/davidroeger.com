<script lang="ts">
	import { debounce } from '$utils';

	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { BREAK_POINTS } from './constants';
	import type { BreakpointContext } from './types';

	const breakpointContext: BreakpointContext = {
		SM: writable(false),
		MD: writable(false),
		LG: writable(false),
		XL: writable(false),
		'2XL': writable(false)
	};

	setContext('breakpoints', breakpointContext);

	const { SM, MD, LG, XL } = breakpointContext;

	const handleResize = (width: number) => {
		$SM = width >= BREAK_POINTS.SM;
		$MD = width >= BREAK_POINTS.MD;
		$LG = width >= BREAK_POINTS.LG;
		$XL = width >= BREAK_POINTS.XL;
	};

	onMount(() => {
		handleResize(window.innerWidth);
	});
</script>

<svelte:window
	on:resize={debounce(() => handleResize(window.innerWidth), 50)}
/>
<slot />
