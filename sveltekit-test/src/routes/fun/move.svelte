<script context="module" lang="ts">
	export const thumbnail = 'move.png';
</script>

<script lang="ts">
	import * as Slider from '$primitives/Slider';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import Close from '$assets/Icons/24/close.svg';
	import West from '$assets/Icons/24/west.svg';
	import East from '$assets/Icons/24/east.svg';
	import South from '$assets/Icons/24/south.svg';
	import * as Accordion from '$primitives/Accordion';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type ImageData = {
		img: HTMLImageElement;
		w: number;
		h: number;
		newWidth: number;
		newHeight: number;
	};

	let imageCount = 0;
	let previewImage: HTMLImageElement;

	let canvas: HTMLCanvasElement;
	let canvasContainer: HTMLDivElement;
	let downloadButton: HTMLAnchorElement;

	let dimensions = writable({ x: 0, y: 0, width: 0, height: 0 });

	const images: ImageData[] = [];
	let imageCountMax = 7;

	let imageScl = 3;
	let boundImageScl = writable(imageScl);

	let imageIndex = 0;

	//updateScale()

	function loadImage(src: string) {
		const p = new Promise((resolve) => {
			const image = new Image();
			image.addEventListener('load', (e) => {
				resolve(image);
			});
			image.src = src;
		});

		p.then((image: HTMLImageElement) => {
			const ratio = scalePreserveAspectRatio(
				image.width,
				image.height,
				$dimensions.width,
				$dimensions.height
			);
			images.push({
				img: image,
				w: image.width,
				h: image.height,
				newWidth: (image.width * ratio) / imageScl,
				newHeight: (image.height * ratio) / imageScl
			});
			previewImage.src = images[imageIndex].img.src;
			imageCount = images.length;
		});
	}

	onMount(() => {
		for (let i = 0; i < imageCountMax; i++) {
			loadImage(`/assets/fun/move/${i}.png`);
		}
		//window.addEventListener('resize', reload, false);
		//reload();

		const resizeObserver = new ResizeObserver(() => {
			if (canvasContainer) {
				const { x, y, width, height } = canvasContainer.getBoundingClientRect();
				$dimensions = { x, y, width, height };
				reload();
			}
		});
		resizeObserver.observe(canvasContainer, { box: 'border-box' });

		const { x, y, width, height } = canvasContainer.getBoundingClientRect();
		$dimensions = { x, y, width, height };
		reload();
	});

	const reload = () => {
		if (canvas) {
			canvas.width = $dimensions.width;
			canvas.height = $dimensions.height;
		}
	};

	$: {
		images.forEach((image) => {
			const ratio = scalePreserveAspectRatio(
				image.w,
				image.h,
				$dimensions.width,
				$dimensions.height
			);
			image.newWidth = (image.w * ratio) / imageScl;
			image.newHeight = (image.h * ratio) / imageScl;
		});
	}

	const draw = (e: PointerEvent) => {
		if (images[0]) {
			const img = images[imageIndex];
			const x = e.clientX - $dimensions.x - img.newWidth / 2;
			const y = e.clientY - $dimensions.y - img.newHeight / 2;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img.img, 0, 0, img.w, img.h, x, y, img.newWidth, img.newHeight);
			if (canvas && document.activeElement !== canvas) {
				canvas.focus();
			}
		}
	};

	const slideStart = (e: PointerEvent) => {
		const eventTarget = e.target as HTMLElement;
		eventTarget.setPointerCapture(e.pointerId);
		draw(e);
		e.preventDefault();
	};

	const slideMove = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		if (target.hasPointerCapture(e.pointerId)) {
			draw(e);
			e.preventDefault();
		}
	};

	const slideStop = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		if (target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);
		}
	};
	/**
	 * Helper function
	 */

	/**
	 * @param {int} imgW initial Image width
	 * @param {int} imgH initial Image height
	 * @param {int} maxW max Image width
	 * @param {int} maxH max Image height
	 * @returns {int} Scale Value
	 */
	function scalePreserveAspectRatio(imgW, imgH, maxW, maxH) {
		return Math.min(maxW / imgW, maxH / imgH);
	}

	function setNext() {
		if (images.length) {
			imageIndex++;
			imageIndex = imageIndex % images.length;
			previewImage.src = images[imageIndex].img.src;
		}
	}

	function setPrevious() {
		if (images.length) {
			if (!imageIndex) {
				imageIndex = images.length - 1;
			} else {
				imageIndex--;
				imageIndex = imageIndex % images.length;
			}
			previewImage.src = images[imageIndex].img.src;
		}
	}

	const nextKey = 'ArrowDown';
	const prevKey = 'ArrowUp';
	const bigger = 'ArrowRight';
	const smaller = 'ArrowLeft';

	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case nextKey:
				setNext();
				e.preventDefault();
				e.stopPropagation();
				break;
			case prevKey:
				setPrevious();
				e.preventDefault();
				e.stopPropagation();
				break;
			case bigger:
				$boundImageScl = $boundImageScl + 1;
				e.preventDefault();
				e.stopPropagation();
				break;
			case smaller:
				$boundImageScl = $boundImageScl - 1;
				e.preventDefault();
				e.stopPropagation();
				break;
			case 'Delete':
			case 'Backspace':
				reload();
				e.preventDefault();
				e.stopPropagation();
				break;
			default:
				break;
		}
	};

	let showInfo = false;
</script>

<!--svelte:window on:keydown={handleKeyDown} /-->

<section class="relative">
	<Accordion.Root
		type="single"
		defaultValue=""
		collapsible
		class="relative z-10"
		on:valueChange={() => {
			showInfo = !showInfo;
		}}
	>
		<Accordion.Item value="info">
			<Accordion.Header class="absolute">
				<Accordion.Trigger
					class={`${
						showInfo ? 'm-2' : 'm-4'
					} top-0 transition-[margin] text-sm right-0 h-5 w-5 border text-mauve-12 border-mauve-12 bg-white/60 backdrop-blur-md focus:outline-none ring-mauve-12 focus:ring-1`}
					><AccessibleIcon label="Close info"><span aria-hidden="true">i</span></AccessibleIcon
					></Accordion.Trigger
				>
			</Accordion.Header>
			<Accordion.Content class="p-2 pl-10 text-sm border-b border-mauve-6 text-mauve-11">
				Move your cursor over the blue background
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
	<div class="relative p-2 pr-4 bg-white/[.85]">
		<div
			class="bg-blue-5 relative w-full portrait:aspect-w-1 portrait:aspect-h-1 landscape:aspect-w-[2.35] landscape:aspect-h-1 landscape:md:aspect-w-16 landscape:md:aspect-h-[8.5]"
			bind:this={canvasContainer}
		>
			<canvas
				on:keydown={handleKeyDown}
				tabindex="-1"
				class="border touch-none focus:outline-none ring-mauve-6 focus:ring-1 border-mauve-6"
				bind:this={canvas}
				on:pointerdown={(e) => slideStart(e)}
				on:pointermove={(e) => slideMove(e)}
				on:pointerup={(e) => slideStop(e)}
			/>
		</div>

		<div
			class="absolute flex border pointer-events-none top-2 right-4 border-mauve-6 bg-white/60 backdrop-blur-md"
		>
			<img
				alt="preview"
				bind:this={previewImage}
				width="40"
				height="40"
				class={` ${imageCount ? 'w-10 h-10' : 'hidden'}`}
			/>
			<div class={`w-10 h-10 p-2 ${imageCount ? 'hidden' : ''}`}>
				<AccessibleIcon label="loading"
					><span
						aria-hidden="true"
						class="block w-full h-full border border-t-0 border-b-0 rounded-full border-mauve-12 animate-spin"
					/>
				</AccessibleIcon>
			</div>
			<p
				class="flex items-center justify-center p-2 font-mono text-center border-l border-mauve-6 text-mauve-11"
			>
				{imageCount ? imageIndex + 1 : '?'} / {imageCount}
			</p>
		</div>
	</div>
	<div
		class="bg-white/[.85] flex flex-col items-center justify-center pt-2 md:pt-0 border-t border-b md:flex-row border-mauve-6"
	>
		<div class="w-full px-8 md:w-fit-content">
			<Slider.Root
				on:valueChange={(e) => (imageScl = 6 - e.detail.values[0])}
				class="flex items-center w-full py-4 md:w-96"
				min={1}
				max={5}
				step={1}
				label="image size"
			>
				<Slider.Track class="h-2 bg-white border rounded-full border-mauve-12">
					<Slider.Range class="h-full rounded-full bg-blue-5" />
				</Slider.Track>
				<Slider.Thumb
					value={boundImageScl}
					defaultValue={imageScl}
					class="w-6 h-6 bg-white border rounded-full border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 touch-none"
				/>
			</Slider.Root>
		</div>
		<div class="flex justify-center m-2 space-x-4">
			<a
				bind:this={downloadButton}
				on:click={() => {
					downloadButton.href = canvas.toDataURL('image/png');
				}}
				href={'#'}
				download="mosaik.png"
				class="p-2 bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
			>
				<AccessibleIcon label="Download"><South /></AccessibleIcon>
			</a>
			<button
				on:click={() => reload()}
				class="p-2 bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
			>
				<AccessibleIcon label="Clear Canvas"><Close /></AccessibleIcon>
			</button>
			<button
				on:click={() => setPrevious()}
				class="p-2 bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
			>
				<AccessibleIcon label="Previous Image"><West /></AccessibleIcon>
			</button>
			<button
				on:click={() => setNext()}
				class="p-2 bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
			>
				<AccessibleIcon label="Next Image"><East /></AccessibleIcon>
			</button>
		</div>
	</div>
</section>
