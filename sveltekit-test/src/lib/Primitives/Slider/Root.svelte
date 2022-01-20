<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let min: number;
	export let max: number;
	export let step: number = 1;
	export let minStepsBetweenThumbs: number = 0;

	export let disabled: boolean = false;
	export let name: string = undefined;
	export let label: string = undefined;
	export let orientation: 'horizontal' | 'vertical' = 'horizontal';
	export let dir: 'ltr' | 'rtl' = 'ltr';

	let c = '';
	export { c as class };

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext, Direction, Size, Value } from './types';
	import { limit } from '$lib/Utils';
	import { getDecimalCount, hasMinStepsBetweenValues, linearScale, roundValue } from './utils';

	id++;

	const start: Direction =
		orientation === 'horizontal' ? (dir === 'ltr' ? 'left' : 'right') : 'top';
	const end: Direction =
		orientation === 'horizontal' ? (dir === 'ltr' ? 'right' : 'left') : 'bottom';
	const size: Size = orientation === 'horizontal' ? 'width' : 'height';

	const rootContext: RootContext = {
		id: `drds-slider-${id.toString()}`,
		min: min,
		max: max,
		step: step,
		disabled: disabled,
		orientation: orientation,
		activeValues: writable([]),
		setSlider: writable(undefined),
		focusThumb: writable(undefined),
		start: start,
		end: end,
		direction: dir === 'ltr' || orientation === 'vertical' ? 1 : -1,
		size: size,
		name: `${name}[]`
	};

	setContext('root', rootContext);
	const { activeValues, setSlider, focusThumb } = rootContext;
	const dispatch = createEventDispatcher<{ valueChange: { values: number[] } }>();

	$setSlider = (value: Value) => {
		const index = $activeValues.findIndex((v) => v.id === value.id);
		if (index === -1) {
			$activeValues.push({ value: value.value, id: value.id, element: value.element });
			$activeValues = [...$activeValues];
			return;
		}

		const decimalCount = getDecimalCount(step);
		const snapToStep = roundValue(
			Math.round((value.value - min) / step) * step + min,
			decimalCount
		);
		const nextValue = limit(snapToStep, min, max);

		let nextValues = [...$activeValues.map((v) => v.value)];
		nextValues[index] = nextValue;
		nextValues = nextValues.sort((a, b) => a - b);
		if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
			$activeValues[index] = { value: nextValue, id: value.id, element: value.element };
			$activeValues = [...$activeValues];
		}
	};

	$: {
		const returnValue = $activeValues.map((value) => value.value);
		dispatch('valueChange', {
			values: returnValue
		});
	}

	let slider: HTMLDivElement;
	const getValueFromPointer = (pointerPosition: number) => {
		if (slider) {
			const rect = slider.getBoundingClientRect();
			const input: [number, number] = [0, rect[size]];
			const output: [number, number] = dir === 'ltr' ? [min, max] : [max, min];
			const value = linearScale(input, output);

			return value(pointerPosition - (orientation === 'horizontal' ? rect.left : rect.top));
		}
	};

	const getClosestValueIndex = (nextValue: number): number => {
		if ($activeValues.length === 1) return 0;
		const distances = $activeValues.map((value) => Math.abs(value.value - nextValue));
		const closestDistance = Math.min(...distances);
		return distances.indexOf(closestDistance);
	};

	const slideStart = (e: PointerEvent) => {
		if (!disabled) {
			const eventTarget = e.target as HTMLElement;
			eventTarget.setPointerCapture(e.pointerId);

			const value = getValueFromPointer(orientation === 'horizontal' ? e.clientX : e.clientY);
			const closestIndex = getClosestValueIndex(value);
			const active = $activeValues[closestIndex];
			if (active && $setSlider) {
				console.log(active);
				active.element.focus();
				$setSlider({ value: value, id: active.id, element: active.element });
				e.preventDefault();
			}
		}
	};

	const slideMove = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		if (target.hasPointerCapture(e.pointerId) && !disabled) {
			const value = getValueFromPointer(orientation === 'horizontal' ? e.clientX : e.clientY);
			if ($focusThumb) {
				$setSlider({ value: value, id: $focusThumb.id, element: $focusThumb.element });
				e.preventDefault();
			}
		}
	};

	const slideStop = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		if (target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);
		}
	};
</script>

<div
	bind:this={slider}
	class={c}
	data-orientation={orientation}
	aria-disabled={disabled}
	aria-label={label}
	style="position: relative; cursor: pointer;"
	on:pointerdown={(e) => slideStart(e)}
	on:pointermove={(e) => slideMove(e)}
	on:pointerup={(e) => slideStop(e)}
>
	<slot />
</div>
