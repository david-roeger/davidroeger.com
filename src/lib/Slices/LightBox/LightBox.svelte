<script lang="ts">
	import * as Dialog from '$primitives/Dialog';
	import type { BreakpointContext } from '$provider/BreakpointProvider/types';
	import type { Media as MediaType } from '$types';
	import { debounce } from '$utils';

	import { createEventDispatcher, getContext, onMount, tick } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { derived, writable, type Writable } from 'svelte/store';
	import type { ActiveMedia, MediaSize } from './types';
	import { createNestedMediaArray, getTargetScale } from './utils';

	import West from '$assets/Icons/24/west.svg?component';
	import Close from '$assets/Icons/24/close.svg?component';
	import East from '$assets/Icons/24/east.svg?component';

	import { AccessibleIcon } from '$components/AccessibleIcon';
	import { Media } from '$components/Media';
	import { fade } from 'svelte/transition';
	import { Slide } from '$components/Slide';
	import type { Readable } from 'nodemailer/lib/xoauth2';
	import { AnimatedEntry } from '$components/AnimatedEntry';

	export let mediaArray: MediaType[];
	export let defaultIndex: number | undefined = undefined;
	export let assetPath: string;

	export let title: string;
	export let description: string;

	const BUTTON_WIDTH = 50;
	const BUTTONS_WIDTH = BUTTON_WIDTH * 2;

	let innerWidth: number;
	let innerHeight: number;

	let enabled = true;

	let setClose: Writable<(() => void) | undefined> | undefined;

	const { MD }: BreakpointContext = getContext('breakpoints');
	$: nestedMediaArray = createNestedMediaArray($MD, mediaArray);

	const index = writable<number | undefined>(defaultIndex);
	const sizes = writable<MediaSize[]>([]);

	const activeMedia = derived(
		[index, sizes],
		([$index, $sizes]) => {
			if ($index === undefined) {
				return {
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
			}

			const media = mediaArray[$index];
			const size = $sizes[$index];
			if (!media || !size) {
				return {
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
			}

			return {
				index: $index,
				media,
				...size
			};
		},
		{
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
		}
	);

	$: console.log($activeMedia);
	const instant = { duration: 0 };
	const transition = { duration: 300 };

	let DIRECTION = derived(
		[index],
		([$index]) => {
			if ($index !== undefined) {
				const activeIndex = $activeMedia.index;
				if (activeIndex !== $index) {
					const loopedForward =
						activeIndex === mediaArray.length - 1 && $index === 0;
					const loopedBackward =
						activeIndex === 0 && $index === mediaArray.length - 1;

					if (activeIndex === undefined) {
						return 1 as const;
					} else if (loopedForward) {
						return 1 as const;
					} else if (loopedBackward) {
						return -1 as const;
					} else if (activeIndex > $index) {
						return -1 as const;
					} else if (activeIndex < $index) {
						return 1 as const;
					}
				}
			}

			return 1 as const;
		},
		1 as const
	);

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

	let opacity = tweened(index !== undefined ? 1 : 0, {
		easing: cubicInOut,
		...transition
	});

	let section: HTMLElement;

	const dispatch = createEventDispatcher<{
		mediaChange: { index: number | undefined };
	}>();

	const dispatchDialog = createEventDispatcher<{
		dialogChange: { index: number | undefined; open: boolean };
	}>();

	const handleDialogOpen = async () => {
		enabled = true;
		if (!$activeMedia || $activeMedia.index === undefined) return;
		await updateSizes();
		const size = $sizes[$activeMedia.index];
		if (!size) return;

		dispatchDialog('dialogChange', {
			index: $activeMedia.index,
			open: true
		});

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
		if ($activeMedia.index === undefined) return;
		const size = $sizes[$activeMedia.index];
		if (!size) return;
		const element = section.querySelector(
			`button[data-galery-index="${$activeMedia.index}"]`
		) as HTMLElement;

		dispatchDialog('dialogChange', {
			index: $activeMedia.index,
			open: false
		});

		requestAnimationFrame(async () => {
			await Promise.all([
				scale.set(size.scale, transition),
				offsetX.set(size.x, transition),
				offsetY.set(size.y, transition),
				opacity.set(0)
			]);

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
		console.log(computedInnerWidth);
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
			console.log(
				element.dataset.galeryIndex,
				width,
				height,
				width / height,
				targetWidth,
				targetHeight
			);

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

	const updateSizes = async () => {
		if (!section) return;
		const buttons = section.querySelectorAll('button[data-galery-index]');
		$sizes = await calculateSizes(Array.from(buttons));
	};

	let mounted = false;

	onMount(async () => {
		console.log('mounted');
		updateSizes();
		// if is md we need to update the sizes after layout shift
		MD.subscribe(async (v) => {
			if (v) {
				console.log('md', v);
				await tick();
				updateSizes();
			}
		});
		mounted = true;
	});

	$: offsetX.set($activeMedia.targetX, instant);
	$: offsetY.set($activeMedia.targetY, instant);
	$: console.log($offsetX);
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
			class="mb-32 flex border-b border-mauve-6 p-1"
			defaultOpen={$index !== undefined}
			bind:setClose
			on:openChange={async (e) => {
				if (e.detail.open) {
					await handleDialogOpen();
				}
			}}
		>
			{#each nestedMediaArray as nestedMedia}
				<div class="flex flex-1 flex-col">
					{#each nestedMedia as medium (medium.src)}
						{@const mediaIndex = mediaArray.indexOf(medium)}
						<div class="m-1 flex">
							<AnimatedEntry>
								<Dialog.Trigger
									tabindex={0}
									title="Open Overlay"
									data-galery-index={mediaIndex}
									class="ring-mauve-6 focus:outline-none focus:ring-2"
									on:click={() => ($index = mediaIndex)}
								>
									<Media
										media={medium}
										src="/assets/projects/{assetPath}/{medium.src}"
										alt=""
										class="block"
									/>
								</Dialog.Trigger>
							</AnimatedEntry>
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
					class="fixed top-0 h-full w-full overscroll-contain bg-mauve-12/80"
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
								e.stopImmediatePropagation();

								const activeIndex = $activeMedia.index || 0;
								const nextIndex =
									activeIndex === mediaArray.length - 1
										? 0
										: activeIndex + 1;

								dispatch('mediaChange', {
									index: nextIndex
								});

								$index = nextIndex;
							}
						} else if (e.key === 'ArrowLeft') {
							if (enabled) {
								e.stopImmediatePropagation();

								const activeIndex = $activeMedia.index || 0;
								const prevIndex =
									activeIndex === 0
										? mediaArray.length - 1
										: activeIndex - 1;

								dispatch('mediaChange', {
									index: prevIndex
								});

								$index = prevIndex;
							}
						}
					}}
					class="pointer-events-none fixed inset-0"
				>
					<Dialog.Title class="sr-only">{title}</Dialog.Title>
					<Dialog.Description class="sr-only">
						<p>{description}</p>
					</Dialog.Description>
					{#key mounted}
						<div class="h-full w-full" in:fade>
							{#if $activeMedia.media}
								<Slide
									class="h-full w-full"
									key={$activeMedia.index}
									direction={$DIRECTION}
									on:introstart={() => (enabled = false)}
									on:introend={() => (enabled = true)}
								>
									<div
										style:width="{$activeMedia.targetWidth}px"
										style:height="{$activeMedia.targetHeight}px"
										style:transform="translateX({$offsetX}px)
										translateY({$offsetY}px) scale({$scale})"
										class="pointer-events-auto origin-top-left"
									>
										<Media
											media={$activeMedia.media}
											src="/assets/projects/{assetPath}/{$activeMedia
												.media.src}"
											alt=""
											class="block h-full w-full border-mauve-6"
										/>
									</div>
								</Slide>
							{/if}
						</div>
					{/key}

					<div
						class="absolute left-0 top-1/2 -translate-y-1/2 transform p-2"
					>
						<button
							class="pointer-events-auto z-10 block cursor-w-resize touch-manipulation rounded-full border bg-white p-1 text-xs ring-mauve-12 focus:outline-none focus:ring-1"
							style="opacity: {$opacity};"
							on:click={() => {
								if (!enabled) return;
								const activeIndex = $activeMedia.index || 0;
								const prevIndex =
									activeIndex === 0
										? mediaArray.length - 1
										: activeIndex - 1;

								dispatch('mediaChange', {
									index: prevIndex
								});

								$index = prevIndex;
							}}
						>
							<AccessibleIcon label="Go to previous">
								<West />
							</AccessibleIcon>
						</button>
					</div>

					<div
						class="absolute right-0 top-1/2 -translate-y-1/2 transform p-2"
					>
						<button
							id="lightbox-next"
							class="pointer-events-auto z-10 block cursor-e-resize touch-manipulation rounded-full border bg-white p-1 text-xs ring-mauve-12 focus:outline-none focus:ring-1"
							style="opacity: {$opacity};"
							on:click={() => {
								if (!enabled) return;
								const activeIndex = $activeMedia.index || 0;
								const nextIndex =
									activeIndex === mediaArray.length - 1
										? 0
										: activeIndex + 1;
								dispatch('mediaChange', {
									index: nextIndex
								});

								$index = nextIndex;
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
						class="fixed right-0 top-0 m-2 rounded-full border border-mauve-12 bg-white/[.85] p-1 ring-mauve-12 focus:outline-none focus:ring-1"
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
