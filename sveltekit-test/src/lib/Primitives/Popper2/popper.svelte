<script lang="ts">
	import { useRect } from './useRect';
	import { useSize } from './useSize';
	import { getPlacementData, SIDE_OPTIONS, ALIGN_OPTIONS } from './popper';

	import { onDestroy } from 'svelte';
	import { derived, get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	import { convertStyleString } from '$utils';

	const sideIndex = writable(1);
	const alignIndex = writable(1);
	const sideOffset = writable(8);
	const alignOffset = writable(0);
	const collisionTolerance = writable(0);

	const side = derived(sideIndex, ($sideIndex) => SIDE_OPTIONS[$sideIndex]);
	const align = derived(alignIndex, ($alignIndex) => ALIGN_OPTIONS[$alignIndex]);

	let anchor: HTMLDivElement;
	let anchorRect: Writable<{ rect: DOMRect; onDestroy: () => void }>;

	let popper: HTMLDivElement;
	//let popperSize = useSize(popper);
	let popperSize: Writable<{
		size: {
			width: number;
			height: number;
		};
		onDestroy: () => void;
	}>;

	let computedStyles = '';

	$: {
		if (anchor && !anchorRect) {
			anchorRect = useRect(anchor);
		}
		if (popper && !popperSize) {
			popperSize = useSize(popper);
		}
		if ($anchorRect && $anchorRect.rect && $popperSize && $popperSize.size) {
			const { popperStyles } = getPlacementData({
				anchorRect: $anchorRect.rect,
				popperSize: $popperSize.size,
				side: $side,
				sideOffset: $sideOffset,
				align: $align,
				alignOffset: $alignOffset,
				shouldAvoidCollisions: true,
				collisionBoundariesRect: DOMRect.fromRect({
					width: window.innerWidth,
					height: window.innerHeight,
					x: 0,
					y: 0
				}),
				collisionTolerance: $collisionTolerance
			});

			let string = '';

			for (const [key, value] of Object.entries(popperStyles)) {
				string += `${convertStyleString(key)}: ${value};
				`;
			}

			computedStyles = string;
		}
	}

	onDestroy(() => {
		if ($popperSize && $popperSize.onDestroy) {
			$popperSize.onDestroy();
		}
		if ($anchorRect && $anchorRect.onDestroy) {
			$anchorRect.onDestroy();
		}
	});
</script>

<div style="display: flex; align-items: center; justify-content: center; height: 100vh">
	<div
		bind:this={anchor}
		style="display: flex; align-items: center; justify-content: center; width: 100px; height: 100px; background-color: #ccc;"
	>
		Anchor
	</div>

	<div style={computedStyles}>
		<div
			bind:this={popper}
			style="display: flex; align-items: center; justify-content: center; width: 180px; height: 180px; background-color: hotpink;"
		>
			<div style="display: flex">
				<div style="display: flex; flex-direction: column; margin-right: 10px">
					side
					<select bind:value={$sideIndex} style="margin-bottom: 10px">
						{#each SIDE_OPTIONS as side, index}
							<option value={index}>
								{side}
							</option>
						{/each}
					</select>
					align
					<select bind:value={$alignIndex} style="margin-bottom: 10px">
						{#each ALIGN_OPTIONS as align, index}
							<option value={index}>
								{align}
							</option>
						{/each}
					</select>
				</div>
				<div style="display: flex; flex-direction: column;">
					offset
					<input
						type="number"
						min="-20"
						max="20"
						step="1"
						bind:value={$sideOffset}
						style="margin-bottom: 10px"
					/>
					offset
					<input
						type="number"
						min="-20"
						max="20"
						step="1"
						bind:value={$alignOffset}
						style="margin-bottom: 10px"
					/>
					tolerance
					<input type="number" min="0" max="100" step="1" bind:value={$collisionTolerance} />
				</div>
			</div>
		</div>
	</div>
</div>
