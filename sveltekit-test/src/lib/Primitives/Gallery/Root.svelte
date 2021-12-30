<script context="module">
	let id = 0;
</script>

<script lang="ts">
	//export let defaultValue: string ;
	export let step = 0.75;
	export let direction: 'horizontal' | 'vertical' = 'horizontal';
	export let defaultStart = true;
	export let defaultEnd = true;

	let c = '';
	export { c as class };

	import { setContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import type { RootContext } from './types';

	id++;
	const rootContext: RootContext = {
		id: `drds-galery-${id.toString()}`,
		direction: direction,
		setGallery: writable(undefined),
		container: writable(undefined),
		step: step,
		computedStep: writable(undefined),
		start: writable(defaultStart),
		end: writable(defaultEnd)
	};

	setContext('root', rootContext);
	const { setGallery, container, end, start } = rootContext;

	$setGallery = (offset: number) => {
		if ($container) {
			$container.scrollBy({
				top: 0,
				left: offset,
				behavior: 'smooth'
			});
		}
	};

	const dispatchEnd = createEventDispatcher<{ end: { end: boolean } }>();
	$: dispatchEnd('end', {
		end: $end
	});

	const dispatchStart = createEventDispatcher<{ start: { start: boolean } }>();
	$: dispatchStart('start', {
		start: $start
	});

	$: console.log($start);
</script>

<div aria-roledescription={'galery'} data-orientation={direction} class={`${c}`}>
	<slot />
</div>
