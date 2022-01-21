<script context="module">
	let thumbId = 0;
</script>

<script lang="ts">
	import { hasParentOfType, limit } from '$lib/Utils';

	import { writable } from 'svelte/store';

	export let defaultValue: number;
	export let bindValue = writable(0);
	export { bindValue as value };

	let c = '';
	export { c as class };

	import { getContext, onDestroy, onMount } from 'svelte';
	import type { RootContext } from './types';
	import { convertValueToPercentage, getLabel, getThumbInBoundsOffset } from './utils';

	thumbId++;
	let thumb: HTMLSpanElement;

	const {
		id,
		orientation,
		disabled,
		min,
		max,
		start,
		step,
		size,
		activeValues,
		direction,
		setSlider,
		focusThumb,
		name
	}: RootContext = getContext('root');

	const computedId = `${id}-thumb-${thumbId}`;

	let value = limit(defaultValue, min, max);
	let percent = 0;
	let thumbInBoundsOffset = 0;
	let label: string;
	let index: number;

	let renderInput = false;
	onMount(() => {
		if (hasParentOfType(thumb, 'form')) {
			renderInput = true;
		}
	});

	bindValue.subscribe((bv) => {
		if ($setSlider && thumb) $setSlider({ value: bv, id: computedId, element: thumb });
	});

	$: {
		if (thumb) {
			const { width, height } = thumb.getBoundingClientRect();
			const thumbSize = { width: width, height: height };
			const orientationSize = thumbSize?.[size];

			// We cast because index could be `-1` which would return undefined
			index = $activeValues.findIndex((v) => v.id === computedId);

			if (index === -1) {
				$activeValues = [...$activeValues, { id: computedId, value: value, element: thumb }];
				index = $activeValues.findIndex((v) => v.id === computedId);
			}

			value = $activeValues[index].value;
			$bindValue = value;
			percent = value === undefined ? 0 : convertValueToPercentage(value, min, max);
			label = getLabel(index, $activeValues.length);
			thumbInBoundsOffset = size ? getThumbInBoundsOffset(orientationSize, percent, direction) : 0;
		}
	}

	const moreKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
	const lessKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

	const handleKeyDown = (e: KeyboardEvent) => {
		if (thumb === document.activeElement && !disabled) {
			switch (e.key) {
				case moreKey:
					{
						const multiplier = e.shiftKey ? 10 : 1;
						const stepInDirection = step * multiplier * direction;
						if ($setSlider)
							$setSlider({ value: value + stepInDirection, id: computedId, element: thumb });
					}
					e.preventDefault();
					e.stopPropagation();
					break;
				case lessKey:
					{
						const multiplier = e.shiftKey ? 10 : 1;
						const stepInDirection = step * multiplier * direction;
						if ($setSlider)
							$setSlider({ value: value - stepInDirection, id: computedId, element: thumb });
					}
					e.preventDefault();
					e.stopPropagation();
					break;
				case 'Home':
					if ($setSlider) $setSlider({ value: min, id: computedId, element: thumb });
					e.preventDefault();
					e.stopPropagation();
					break;
				case 'End':
					if ($setSlider) $setSlider({ value: max, id: computedId, element: thumb });
					e.preventDefault();
					e.stopPropagation();
					break;
				default:
					break;
			}
		}
	};

	onDestroy(() => {
		$activeValues = [...$activeValues.filter((v) => v.id !== computedId)];
	});
</script>

<!-- on mount add to thumbs-->
<!-- on destroy remove from thumbs-->

{#if renderInput}
	<input
		{name}
		{value}
		aria-hidden="true"
		tabindex="-1"
		style="position: absolute; pointer-events: none; opacity: 0;"
		{disabled}
	/>
{/if}

<span
	on:focus={() => ($focusThumb = { id: computedId, value: value, element: thumb })}
	on:blur={() => ($focusThumb = undefined)}
	class={c}
	bind:this={thumb}
	on:keydown={handleKeyDown}
	on:keydown
	style={`transform: translate${
		orientation === 'horizontal' ? 'X' : 'Y'
	}(-50%); position: absolute; ${start}: calc(${percent}% + ${thumbInBoundsOffset}px);`}
	role="slider"
	aria-label={label}
	aria-labelledby={label ? undefined : `${id}`}
	aria-valuemin={min}
	aria-valuenow={value}
	aria-valuemax={max}
	aria-orientation={orientation}
	data-orientation={orientation}
	data-disabled={disabled}
	tabIndex={disabled ? undefined : 0}
	id={computedId}
>
	<slot />
</span>
