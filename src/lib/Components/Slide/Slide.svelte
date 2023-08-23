<script lang="ts">
	import { mapToRange } from '$utils';
	import BezierEasing from 'bezier-easing';

	let c = '';
	export { c as class };

	export let as = 'div';

	export let key: unknown;
	export let direction: 1 | -1 = 1;

	const baseEasing = BezierEasing(0.4, 0, 0.2, 1);
	const reversedEasing = BezierEasing(0.8, 0, 0.6, 1);
	function slide(
		_: HTMLElement,
		{ start = -100, end = 0, duration = 150, easing = baseEasing }
	) {
		return {
			duration,
			css: (t: number) => {
				const eased = easing(t);
				const mapped = mapToRange(eased, 0, 1, start, end);
				return `transform: translateX(${mapped}%); position: relative;`;
			}
		};
	}
</script>

<div class="grid grid-cols-1 grid-rows-1 overflow-x-hidden {c}">
	{#key key}
		<svelte:element
			this={as}
			in:slide={{
				start: direction === 1 ? 100 : -100,
				end: 0,
				duration: 500
			}}
			out:slide={{
				start: direction === 1 ? -100 : 100,
				end: 0,
				duration: 500,
				easing: reversedEasing
			}}
			class="col-start-1 row-start-1 w-full"
			on:introstart
			on:introend
		>
			<slot />
		</svelte:element>
	{/key}
</div>
