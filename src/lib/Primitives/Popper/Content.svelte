<script lang="ts">
	import { getContext, onMount, tick } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import { createFocusTrap } from 'focus-trap';
	import {
		type Placement,
		type Middleware,
		autoUpdate,
		offset,
		shift,
		limitShift,
		hide,
		flip,
		size,
		computePosition
	} from '@floating-ui/dom';

	import { clickOutside } from '$actions';

	import type { Side, Align, RootContext } from './types';

	export let side: Side;
	export let align: Align;
	export let sideOffset = 0;
	export let alignOffset = 0;
	export let collisionTolerance = 0;
	export let avoidCollisions = true;

	let collisionPaddingProp: number | Partial<Record<Side, number>> = 0;
	export { collisionPaddingProp as collisionPadding };
	export let sticky: 'partial' | 'always' = 'partial';
	export let hideWhenDetached = false;
	export let updatePositionStrategy: 'optimized' | 'always' = 'optimized';

	export let onPlaced = () => {};

	let c = '';
	export { c as class };

	const { open, id, trap, setClose, triggerElement }: RootContext =
		getContext('root');

	const desiredPlacement = (side +
		(align !== 'center' ? '-' + align : '')) as Placement;

	const collisionPadding =
		typeof collisionPaddingProp === 'number'
			? collisionPaddingProp
			: { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };

	const detectOverflowOptions = {
		padding: collisionPadding,
		boundary: [],
		// with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
		altBoundary: false
	};

	const styles = writable({
		transform: 'translate(0, -200%)',
		transformOrigin: 'center center'
	});

	function getSideAndAlignFromPlacement(placement: Placement) {
		const [side, align = 'center'] = placement.split('-');
		return [side as Side, align as Align] as const;
	}

	const transformOrigin = (): Middleware => ({
		name: 'transformOrigin',
		fn(data) {
			const { placement } = data;

			const [placedSide, placedAlign] =
				getSideAndAlignFromPlacement(placement);

			let x: 'left' | 'right' | 'center' = 'center';
			let y: 'top' | 'bottom' | 'center' = 'center';

			if (placedSide === 'bottom') {
				if (placedAlign === 'start') {
					x = 'left';
				} else if (placedAlign === 'end') {
					x = 'right';
				}
				y = 'top';
			} else if (placedSide === 'top') {
				if (placedAlign === 'start') {
					x = 'left';
				} else if (placedAlign === 'end') {
					x = 'right';
				}
				y = 'bottom';
			} else if (placedSide === 'right') {
				x = 'left';
				if (placedAlign === 'start') {
					y = 'top';
				} else if (placedAlign === 'end') {
					y = 'bottom';
				}
			} else if (placedSide === 'left') {
				x = 'right';
				if (placedAlign === 'start') {
					y = 'top';
				} else if (placedAlign === 'end') {
					y = 'bottom';
				}
			}

			return { data: { x, y } };
		}
	});

	function roundByDPR(value: number) {
		const dpr = window.devicePixelRatio || 1;
		return Math.round(value * dpr) / dpr;
	}

	const computePositionFunction = () => {
		if ($triggerElement && content) {
			computePosition($triggerElement, content, {
				strategy: 'fixed',
				placement: desiredPlacement,
				middleware: [
					offset({
						mainAxis: sideOffset,
						alignmentAxis: alignOffset
					}),
					avoidCollisions &&
						shift({
							mainAxis: true,
							crossAxis: false,
							limiter:
								sticky === 'partial' ? limitShift() : undefined,
							...detectOverflowOptions
						}),
					avoidCollisions && flip({ ...detectOverflowOptions }),
					size({
						...detectOverflowOptions,
						apply: ({
							elements,
							rects,
							availableWidth,
							availableHeight
						}) => {
							const {
								width: triggerWidth,
								height: triggerHeight
							} = rects.reference;

							const contentStyle = elements.floating.style;
							contentStyle.setProperty(
								'--drds-popper-available-width',
								`${availableWidth}px`
							);
							contentStyle.setProperty(
								'--drds-popper-available-height',
								`${availableHeight}px`
							);
							contentStyle.setProperty(
								'--drds-popper-trigger-width',
								`${triggerWidth}px`
							);
							contentStyle.setProperty(
								'--drds-popper-trigger-height',
								`${triggerHeight}px`
							);
						}
					}),
					transformOrigin(),
					hideWhenDetached &&
						hide({
							strategy: 'referenceHidden',
							...detectOverflowOptions
						})
				]
			}).then((result) => {
				$styles.transform = `translate(${roundByDPR(
					result.x
				)}px, ${roundByDPR(result.y)}px)`;

				$styles.transformOrigin = `${result.middlewareData.transformOrigin.y} ${result.middlewareData.transformOrigin.x}`;
			});
		}
	};

	const dataState = derived(open, ($open) => ($open ? 'open' : 'closed'));

	let content: HTMLElement;
	let mounted = false;
	$: activateTrap($open);

	const activateTrap = async (state: boolean) => {
		if (state && !$trap && mounted) {
			await tick();
			$trap = createFocusTrap(content, {
				allowOutsideClick: true,
				escapeDeactivates: false,
				fallbackFocus: content
			});
			$trap.activate();
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if ($setClose) $setClose();
			e.preventDefault();
			e.stopPropagation();
		}
	};

	onMount(() => {
		mounted = true;
		activateTrap($open);

		if ($triggerElement && content) {
			const cleanup = autoUpdate(
				$triggerElement,
				content,
				computePositionFunction,
				{
					animationFrame: updatePositionStrategy === 'always'
				}
			);

			return () => {
				cleanup();
			};
		}
	});
</script>

<div
	style="
		z-index: 100;
		position: absolute;
		top: 0;
		left: 0;
		transform: {$open ? $styles.transform : 'translate(0, -200%)'}; 
		transform-origin: {$styles.transformOrigin};
		pointer-events: {$open ? 'auto' : 'none'};
		minWidth: 'max-content';
		visibility: {$open ? 'visible' : 'hidden'};
		opacity: {$open ? 1 : 0};
		--drds-popper-transform-origin: {$styles.transformOrigin};
		will-change: transform;
	"
	class="group/drds-popper"
	role="dialog"
	aria-modal="true"
	id="{id}-content"
	aria-labelledby="{id}-title"
	aria-describedby="{id}-description"
	tabindex="-1"
	bind:this={content}
	on:keydown
	on:keydown={handleKeyDown}
	aria-hidden={!$open}
	use:clickOutside={() => {
		if ($setClose && $open) $setClose();
	}}
	data-state={$dataState}
>
	<div
		style:transform-origin="var(--drds-popper-transform-origin)"
		data-state={$dataState}
		class={c}
	>
		<slot />
	</div>
</div>
