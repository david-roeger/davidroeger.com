<script lang="ts">
	import * as Dialog from '$primitives/Dialog';
	import type { BreakpointContext } from '$lib/Provider/BreakpointProvider/types';
	import type { Media as MediaType } from '$lib/types';
	import { debounce, mapToRange } from '$utils';
	import BezierEasing from 'bezier-easing';

	import { createEventDispatcher, getContext, onMount, tick } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import type { Writable } from 'svelte/store';
	import type { ActiveMedia, MediaSize } from './types';
	import { createNestedMediaArray, getTargetScale } from './utils';

	import West from '$assets/Icons/24/west.svg?component';
	import Close from '$assets/Icons/24/close.svg?component';
	import East from '$assets/Icons/24/east.svg?component';

	import { AccessibleIcon } from '$components/AccessibleIcon';
	import { Media } from '$components/Media';
	import { fade } from 'svelte/transition';

	export let mediaArray: MediaType[];
	export let defaultIndex: number | undefined = undefined;
	export let assetPath: string;

	export let title: string;
	export let description: string;

	const BUTTON_WIDTH = 50;
	const BUTTONS_WIDTH = BUTTON_WIDTH * 2;

	let innerWidth: number;
	let innerHeight: number;
	let sizes: MediaSize[] = [];

	let enabled = true;

	let setClose: Writable<(() => void) | undefined> | undefined;

	const { MD }: BreakpointContext = getContext('breakpoints');
	$: nestedMediaArray = createNestedMediaArray($MD, mediaArray);

	let activeMedia: ActiveMedia =
		defaultIndex !== undefined
			? {
					index: defaultIndex,
					media: mediaArray[defaultIndex],
					width: 0,
					height: 0,
					x: 0,
					y: 0,
					scale: 1,
					targetWidth: 0,
					targetHeight: 0,
					targetScale: 1,
					targetX: 0,
					targetY: 0
			  }
			: {
					index: undefined,
					media: undefined,
					width: 0,
					height: 0,
					x: 0,
					y: 0,
					scale: 1,
					targetWidth: 0,
					targetHeight: 0,
					targetScale: 1,
					targetX: 0,
					targetY: 0
			  };

	const instant = { duration: 0 };
	const transition = { duration: 300 };

	let DIRECTION: 1 | -1 = 1;

	let scale = tweened(1, {
		easing: cubicInOut,
		...transition
	});

	let offsetX = tweened(0, {
		easing: cubicInOut,
		...transition
	});

	let offsetY = tweened(0, {
		easing: cubicInOut,
		...transition
	});

	let opacity = tweened(defaultIndex !== undefined ? 1 : 0, {
		easing: cubicInOut,
		...transition
	});

	let section: HTMLElement;
	const setActiveMedia = (index: number) => {
		const media = mediaArray[index];
		const size = sizes[index];

		if (!media || !size) return;

		activeMedia = {
			index,
			media,
			...size
		};
	};

	const handleDialogOpen = async () => {
		if (!activeMedia || activeMedia.index === undefined) return;
		await updateSizes();
		const size = sizes[activeMedia.index];
		if (!size) return;

		enabled = true;

		// center element
		requestAnimationFrame(() => {
			scale.set(size.scale, instant);
			scale.set(size.targetScale, transition);

			offsetX.set(size.x, instant);
			offsetX.set(size.targetX, transition);
			offsetY.set(size.y, instant);
			offsetY.set(size.targetY, transition);
			opacity.set(1);
		});
	};

	async function handleDialogClose() {
		enabled = false;
		if (activeMedia.index === undefined) return;
		const size = sizes[activeMedia.index];
		if (!size) return;
		const index = activeMedia.index;
		const element = section.querySelector(
			`button[data-galery-index="${index}"]`
		) as HTMLElement;

		requestAnimationFrame(async () => {
			await Promise.all([
				scale.set(size.scale, transition),
				offsetX.set(size.x, transition),
				offsetY.set(size.y, transition),
				opacity.set(0)
			]);

			activeMedia = {
				index: undefined,
				media: undefined,
				width: 0,
				height: 0,
				x: 0,
				y: 0,
				scale: 1,
				targetWidth: 0,
				targetHeight: 0,
				targetScale: 1,
				targetX: 0,
				targetY: 0
			};

			if ($setClose) $setClose();

			if (element)
				element.focus({
					preventScroll: true
				});
		});
	}

	const calculateSizes = async (elements: Element[]) => {
		const sortedElements = elements.sort((a, b) => {
			const aIndex = a.getAttribute('data-galery-index');
			const bIndex = b.getAttribute('data-galery-index');
			if (!aIndex || !bIndex) return 0;
			return parseInt(aIndex) - parseInt(bIndex);
		});

		const sizes: MediaSize[] = [];
		const computedInnerWidth = innerWidth - BUTTONS_WIDTH;
		sortedElements.forEach((element) => {
			const { x, y, width, height } = element.getBoundingClientRect();
			const targetScale = getTargetScale(
				width,
				height,
				computedInnerWidth,
				innerHeight
			);

			const invertedScale = 1 / targetScale;
			const targetWidth = width * invertedScale;
			const targetHeight = height * invertedScale;

			sizes.push({
				width,
				height,
				x,
				y,
				scale: targetScale,

				targetWidth,
				targetHeight,
				targetScale: 1,
				targetX: (computedInnerWidth - targetWidth) / 2 + BUTTON_WIDTH,
				targetY: (innerHeight - targetHeight) / 2
			});
		});
		return sizes;
	};

	let mounted = false;

	onMount(async () => {
		updateSizes();
		// if is md we need to update the sizes after layout shift
		MD.subscribe(async (v) => {
			await tick();
			updateSizes();
		});
		mounted = true;
	});

	const updateSizes = async () => {
		if (!section) return;
		const buttons = section.querySelectorAll('button[data-galery-index]');
		sizes = await calculateSizes(Array.from(buttons));
		if (activeMedia.index !== undefined) {
			activeMedia = {
				...activeMedia,
				...sizes[activeMedia.index]
			};
			offsetX.set(activeMedia.targetX, instant);
			offsetY.set(activeMedia.targetY, instant);
		}
	};

	const baseEasing = BezierEasing(0.4, 0, 0.2, 1);
	const reversedEasing = BezierEasing(0.8, 0, 0.6, 1);

	function slide(
		_: HTMLDivElement,
		{ start = -100, end = 0, duration = 150, easing = baseEasing }
	) {
		return {
			duration,
			css: (t: number) => {
				const eased = easing(t);
				const mapped = mapToRange(eased, 0, 1, start, end);
				return `transform: translateX(${mapped}%);`;
			}
		};
	}

	$: offsetX.set(activeMedia.targetX, instant);
	$: offsetY.set(activeMedia.targetY, instant);

	const dispatch = createEventDispatcher<{
		mediaChange: { index: number | undefined };
	}>();

	$: dispatch('mediaChange', {
		index: activeMedia.index
	});
</script>

<svelte:window
	bind:innerWidth
	bind:innerHeight
	on:scroll={debounce(updateSizes, 50)}
	on:resize={debounce(updateSizes, 50)}
/>

<section bind:this={section}>
	{#if mediaArray.length}
		<Dialog.Root
			class="flex p-1 border-b mb-32 border-mauve-6"
			defaultOpen={defaultIndex !== undefined}
			bind:setClose
			on:openChange={async (e) => {
				if (e.detail.open) {
					await handleDialogOpen();
				}
			}}
		>
			{#each nestedMediaArray as nestedMedia}
				<div class="flex flex-col flex-1 ">
					{#each nestedMedia as medium (medium.src)}
						{@const index = mediaArray.indexOf(medium)}
						<div class="m-1 flex">
							<Dialog.Trigger
								tabindex={0}
								title="Open Overlay"
								data-galery-index={index}
								class="focus:outline-none ring-mauve-6 focus:ring-2"
								on:click={() => setActiveMedia(index)}
							>
								<Media
									media={medium}
									src="/assets/projects/{assetPath}/{medium.src}"
									alt=""
									class="block"
								/>
							</Dialog.Trigger>
						</div>
					{/each}
				</div>
			{/each}
			<Dialog.Portal>
				<Dialog.Overlay
					on:click={async (e) => {
						e.stopImmediatePropagation();
						await handleDialogClose();
					}}
					class="fixed top-0 w-full h-full bg-mauve-12/80 overscroll-contain"
					style="opacity: {$opacity};"
				/>
				<Dialog.Content
					focusTrapOptions={{
						preventScroll: true,
						returnFocusOnDeactivate: false,
						initialFocus: '#lightbox-next'
					}}
					on:keydown={async (e) => {
						if (e.key === 'Escape') {
							e.stopImmediatePropagation();
							await handleDialogClose();
						} else if (e.key === 'ArrowRight') {
							if (enabled) {
								DIRECTION = 1;
								e.stopImmediatePropagation();
								const index = activeMedia.index || 0;
								setActiveMedia(
									index === mediaArray.length - 1
										? 0
										: index + 1
								);
							}
						} else if (e.key === 'ArrowLeft') {
							if (enabled) {
								DIRECTION = -1;
								e.stopImmediatePropagation();
								const index = activeMedia.index || 0;

								setActiveMedia(
									index === 0
										? mediaArray.length - 1
										: index - 1
								);
							}
						}
					}}
					class="fixed inset-0 pointer-events-none"
				>
					<Dialog.Title class="sr-only">{title}</Dialog.Title>
					<Dialog.Description class="sr-only">
						<p>{description}</p>
					</Dialog.Description>
					{#key mounted}
						<div in:fade|local>
							{#if activeMedia.media}
								{#key activeMedia.index}
									<div
										in:slide|local={{
											start: DIRECTION === 1 ? 100 : -100,
											end: 0,
											duration: 500
										}}
										out:slide|local={{
											start: DIRECTION === 1 ? -100 : 100,
											end: 0,
											duration: 500,
											easing: reversedEasing
										}}
										on:introstart={() => (enabled = false)}
										on:introend={() => (enabled = true)}
										class="absolute w-full"
									>
										<div
											style:width="{activeMedia.targetWidth}px"
											style:height="{activeMedia.targetHeight}px"
											style:transform="translateX({$offsetX}px)
											translateY({$offsetY}px) scale({$scale})"
											class="origin-top-left pointer-events-auto"
										>
											<Media
												media={activeMedia.media}
												src="/assets/projects/{assetPath}/{activeMedia
													.media.src}"
												alt=""
												class="border-mauve-6 w-full h-full block"
											/>
										</div>
									</div>
								{/key}
							{/if}
						</div>
					{/key}

					<div
						class="absolute p-2 transform left-0 top-1/2 -translate-y-1/2"
					>
						<button
							class="z-10 block p-1 text-xs bg-white border rounded-full cursor-w-resize touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1 pointer-events-auto"
							style="opacity: {$opacity};"
							on:click={() => {
								if (!enabled) return;
								DIRECTION = -1;
								const index = activeMedia.index || 0;
								setActiveMedia(
									index === 0
										? mediaArray.length - 1
										: index - 1
								);
							}}
						>
							<AccessibleIcon label="Go to previous">
								<West />
							</AccessibleIcon>
						</button>
					</div>

					<div
						class="absolute p-2 transform right-0 top-1/2 -translate-y-1/2"
					>
						<button
							id="lightbox-next"
							class="z-10 block p-1 text-xs bg-white border rounded-full cursor-e-resize touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1 pointer-events-auto"
							style="opacity: {$opacity};"
							on:click={() => {
								if (!enabled) return;
								DIRECTION = 1;
								const index = activeMedia.index || 0;
								setActiveMedia(
									index === mediaArray.length - 1
										? 0
										: index + 1
								);
							}}
						>
							<AccessibleIcon label="Go to next">
								<East />
							</AccessibleIcon>
						</button>
					</div>

					<Dialog.Close
						on:click={async (e) => {
							e.stopImmediatePropagation();
							await handleDialogClose();
						}}
						class="fixed bg-white/[.85] rounded-full top-0 right-0 m-2 p-1 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
						style="opacity: {$opacity};"
					>
						<AccessibleIcon label="Close Fullscreen">
							<Close />
						</AccessibleIcon>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	{/if}
</section>
