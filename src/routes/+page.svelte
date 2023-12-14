<script lang="ts">
	logger.page('index: +page.svelte');
	// ----------------------------------------------------------------

	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	import BezierEasing from 'bezier-easing';

	import { page } from '$app/stores';

	import { Head } from '$components/Head';
	import { Logo } from '$components/Logo';
	import { Displace } from '$components/Displace';
	import { AnimatedEntry } from '$components/AnimatedEntry';

	import { HireMe } from '$slices/HireMe';
	import Background from '$assets/Icons/test.svg?component';

	import { debounce, limit, mapToRange } from '$utils';
	import { logger } from '$utils/logger';
	import { Cube } from '$components/Cube';

	const easing = BezierEasing(0.4, 0, 0.2, 1);

	const calculateOffset = (
		elementWidth: number,
		elementHeight: number,
		scrollPosition: number
	) => {
		const computedElementWidth = limit(elementWidth, 0, elementWidth);
		// scrollposition is a negative value so we need to invert it
		const computedScrollPosition = limit(
			scrollPosition * -1,
			0,
			elementHeight
		);
		const value = mapToRange(
			computedScrollPosition,
			0,
			elementHeight,
			0,
			computedElementWidth
		);

		const percentage = value / computedElementWidth;
		const eased = easing(percentage);

		// the offset needs to be negative because we want to move the element in the opposite direction
		return eased * computedElementWidth * -1;
	};

	let gradient: HTMLSpanElement;
	let logo: HTMLSpanElement;

	let gradientHeight = 0;
	let gradientWidth = 0;
	let scrollPosition = 0;

	let scrollLeft = spring(0, {
		stiffness: 0.1,
		damping: 0.8
	});
	$: $scrollLeft = calculateOffset(
		gradientWidth,
		gradientHeight,
		scrollPosition
	);

	const handleScroll = () => {
		const { top } = document.body.getBoundingClientRect();
		scrollPosition = top;
	};

	const handleResize = () => {
		const { top: bodyTop } = document.body.getBoundingClientRect();
		const { width: logoWidth } = logo.getBoundingClientRect();
		const { top, height, width: gw } = gradient.getBoundingClientRect();
		gradientHeight = top - bodyTop + height;
		const width = window.innerWidth;

		if (width >= 560) {
			gradientWidth = (gw * 2) / 5 - logoWidth;
			return;
		}

		gradientWidth = gw - logoWidth;
	};

	onMount(() => {
		handleScroll();
		handleResize();
	});
</script>

<svelte:window
	on:scroll|passive={handleScroll}
	on:resize={debounce(handleResize, 50)}
/>

<Head />

<section class="mb-32">
	<HireMe title="← Hi, welcome to my site! This is me." />
	<div class="relative">
		<h1
			aria-label="David Röger personal website"
			class="grrrid relative border-b border-mauve-6 p-2 text-8xl md:text-9xl lg:text-10xl"
		>
			<span
				bind:this={gradient}
				aria-hidden="true"
				class="mask grrrid-mask absolute -z-10 min-h-[96px] min-w-[96px] rounded-full border border-mauve-12"
			/>
			<span
				aria-hidden="true"
				class="grrrid-smiley relative flex items-center rounded-full"
			>
				<span
					bind:this={logo}
					class="block"
					style:transform="translateX({$scrollLeft}px)"
				>
					<Logo
						container={true}
						backgroundFill="rgba(255, 255, 255, 0.8)"
						smile={$page.error ? false : true}
						class="h-24 w-24 p-2 md:h-32 md:w-32 lg:h-40 lg:w-40"
					/>
				</span>
			</span>
			<!-- <AnimatedEntry class="grrrid-child grrrid-child-0">
			<Displace text="D" />
		</AnimatedEntry>
		<AnimatedEntry class="grrrid-child grrrid-child-1">
			<Displace text="A" />
		</AnimatedEntry>
		<AnimatedEntry class="grrrid-child grrrid-child-2">
			<Displace text="V" />
		</AnimatedEntry>
		<AnimatedEntry class="grrrid-child grrrid-child-3">
			<Displace text="I" />
		</AnimatedEntry>
		<AnimatedEntry class="grrrid-child grrrid-child-4">
			<Displace text="D" />
		</AnimatedEntry>

		<AnimatedEntry class="grrrid-child grrrid-child-5">
			<Displace
				aria-hidden="true"
				class="select-none"
				text="::"
				split={false}
			/>
		</AnimatedEntry>
		<AnimatedEntry class="grrrid-child grrrid-child-6">
			<Displace text="R" />
		</AnimatedEntry>

		<AnimatedEntry class="grrrid-child grrrid-child-7">
			<Displace text="O" />
		</AnimatedEntry>
		<AnimatedEntry class="grrrid-child grrrid-child-8">
			<Displace text="E" />
		</AnimatedEntry>
		<AnimatedEntry class="grrrid-child grrrid-child-9">
			<Displace text="G" />
		</AnimatedEntry>
		<AnimatedEntry class="grrrid-child grrrid-child-10">
			<Displace text="E" />
		</AnimatedEntry>
		<AnimatedEntry class="grrrid-child grrrid-child-11">
			<Displace text="R" />
		</AnimatedEntry> -->

			<Displace class="grrrid-child grrrid-child-0" text="D" />
			<Displace class="grrrid-child grrrid-child-1" text="A" />
			<Displace class="grrrid-child grrrid-child-2" text="V" />
			<Displace class="grrrid-child grrrid-child-3" text="I" />
			<Displace class="grrrid-child grrrid-child-4" text="D" />
			<Displace
				aria-hidden="true"
				class="grrrid-child grrrid-child-5 select-none"
				text="::"
				split={false}
			/>
			<Displace class="grrrid-child grrrid-child-6" text="R" />
			<Displace class="grrrid-child grrrid-child-7" text="O" />
			<Displace class="grrrid-child grrrid-child-8" text="E" />
			<Displace class="grrrid-child grrrid-child-9" text="G" />
			<Displace class="grrrid-child grrrid-child-10" text="E" />
			<Displace class="grrrid-child grrrid-child-11" text="R" />

			<span class="line-y line-y-0 border-y border-mauve-6" />
			<span class="line-y line-y-1 border-y border-mauve-6" />
			<span class="line-y line-y-2 border-y border-mauve-6" />
			<span class="line-y line-y-3 border-y border-mauve-6" />
			<span class="line-y line-y-4 border-y border-mauve-6" />
			<span class="line-x line-x-0 border-x border-mauve-6" />
			<span class="line-x line-x-1 border-x border-mauve-6" />
			<span class="line-x line-x-2 border-x border-mauve-6" />
			<span class="line-x line-x-3 border-x border-mauve-6" />
			<span class="line-x line-x-4 border-x border-mauve-6" />
			<span class="line-x line-x-5 border-x border-mauve-6" />
			<span class="triangle-wrapper">
				<span
					class="triangle z-10 h-[9px] w-[9px] translate-x-2 translate-y-2 border-l border-t border-mauve-6"
				/>
			</span>
		</h1>
	</div>
	<div class="p-2">
		<div class="flex flex-col gap-2 border border-mauve-6">
			<AnimatedEntry>
				<a
					href="/projects"
					aria-label="Projects"
					class="group/cube-selector flex items-center justify-start gap-8 border-b border-mauve-6 bg-white/[.85] p-2 text-2xl sm:gap-10 sm:py-1 sm:text-4xl md:gap-11 md:py-0 md:text-6xl lg:gap-20 lg:text-8xl"
				>
					<Displace class="break-all" text="PROJECTS" />

					<span class="md:py-2">
						<span
							class="block aspect-1 h-8 w-auto sm:h-10 md:h-[60px] lg:h-24"
						>
							<Cube variant="green" />
						</span>
					</span>
				</a>
			</AnimatedEntry>
			<AnimatedEntry>
				<a
					href="/contact"
					aria-label="About"
					class="group/cube-selector flex items-center justify-start gap-8 border-y border-mauve-6 bg-white/[.85] p-2 text-2xl sm:gap-10 sm:py-1 sm:text-4xl md:gap-11 md:py-0 md:text-6xl lg:gap-20 lg:text-8xl"
				>
					<Displace class="break-all" text="ABOUT" />
					<span class="md:py-2">
						<span
							class="block aspect-1 h-8 w-auto sm:h-10 md:h-[60px] lg:h-24"
						>
							<Cube variant="purple" />
						</span>
					</span>
				</a>
			</AnimatedEntry>
			<AnimatedEntry>
				<a
					href="/contact"
					aria-label="Say hi!"
					class="group/cube-selector flex border-t border-mauve-6 bg-white/[.85] p-2 text-2xl sm:py-1 sm:text-4xl md:py-0 md:text-6xl lg:text-8xl"
				>
					<span
						class="group/displace-selector flex items-center justify-start gap-8 sm:gap-10 md:gap-11 lg:gap-20"
					>
						<Displace class="break-all" text="SAY" />
						<span class="md:py-2">
							<span
								class="block aspect-1 h-8 w-auto sm:h-10 md:h-[60px] lg:h-24"
							>
								<Cube variant="orange" />
							</span>
						</span>
						<Displace class="break-all" text="HI" />
					</span>
				</a>
			</AnimatedEntry>
		</div>
	</div>
</section>

<style>
	.line-y,
	.line-x,
	.triangle-wrapper {
		display: none;
	}

	.triangle-wrapper {
		width: 100%;
		height: 100%;
		justify-content: flex-end;
		align-items: flex-end;
	}
	@media (min-width: 268px) {
		.grrrid {
			display: grid;
			align-items: center;
			gap: 8px;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			grid-template-rows: repeat(5, minmax(0, 1fr));
		}
		.grrrid-mask {
			height: 100%;
			position: relative;

			grid-column: 1 / 4;
			grid-row: 1;
		}
		.grrrid-smiley {
			margin-left: auto;
			grid-column: 1 / -1;
			grid-row: 1;
		}

		:global(.grrrid-child) {
			position: relative;
			text-align: center;
		}

		:global(.grrrid-child-0) {
			grid-column: 1;
			grid-row: 2;
		}

		:global(.grrrid-child-1) {
			grid-column: 2;
			grid-row: 2;
		}
		:global(.grrrid-child-2) {
			grid-column: 3;
			grid-row: 2;
		}
		:global(.grrrid-child-3) {
			grid-column: 1;
			grid-row: 3;
		}
		:global(.grrrid-child-4) {
			grid-column: 2;
			grid-row: 3;
		}
		:global(.grrrid-child-5) {
			grid-column: 3;
			grid-row: 3;
		}
		:global(.grrrid-child-6) {
			grid-column: 1;
			grid-row: 4;
		}
		:global(.grrrid-child-7) {
			grid-column: 2;
			grid-row: 4;
		}
		:global(.grrrid-child-8) {
			grid-column: 3;
			grid-row: 4;
		}
		:global(.grrrid-child-9) {
			grid-column: 1;
			grid-row: 5;
		}
		:global(.grrrid-child-10) {
			grid-column: 2;
			grid-row: 5;
		}
		:global(.grrrid-child-11) {
			grid-column: 3;
			grid-row: 5;
		}

		.line-y {
			display: block;
			height: 100%;
			width: 100%;
			grid-column: 1 / -1;
		}

		.line-y-0 {
			grid-row: 2;
		}
		.line-y-1 {
			grid-row: 3;
		}
		.line-y-2 {
			grid-row: 4;
		}
		.line-y-3 {
			grid-row: 5;
		}

		.line-y-4 {
			display: none;
		}

		.line-x {
			display: block;
			width: 100%;
			height: 100%;
			margin: -8px 0;
			grid-row: 2 / -1;
		}

		.line-x-0 {
			grid-column: 1;
		}
		.line-x-1 {
			grid-column: 2;
		}
		.line-x-2 {
			grid-column: 3;
		}
		.line-x-3,
		.line-x-4,
		.line-x-5 {
			display: none;
		}
	}

	@media (min-width: 320px) {
		.grrrid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.grrrid-smiley {
			grid-column: 1 / 4;
		}

		:global(.grrrid-child-0) {
			grid-column: 4;
			grid-row: 1;
		}

		:global(.grrrid-child-1) {
			grid-column: 3;
			grid-row: 2;
		}
		:global(.grrrid-child-2) {
			grid-column: 4;
			grid-row: 2;
		}
		:global(.grrrid-child-3) {
			grid-column: 1;
			grid-row: 3;
		}
		:global(.grrrid-child-4) {
			grid-column: 2;
			grid-row: 3;
		}
		:global(.grrrid-child-5) {
			grid-column: 4;
			grid-row: 3;
		}
		:global(.grrrid-child-6) {
			grid-column: 2;
			grid-row: 4;
		}
		:global(.grrrid-child-7) {
			grid-column: 3;
			grid-row: 4;
		}
		:global(.grrrid-child-8) {
			grid-column: 4;
			grid-row: 4;
		}
		:global(.grrrid-child-9) {
			grid-column: 1;
			grid-row: 5;
		}
		:global(.grrrid-child-10) {
			grid-column: 2;
			grid-row: 5;
		}
		:global(.grrrid-child-11) {
			grid-column: 3;
			grid-row: 5;
		}

		.line-y-4 {
			display: block;
			grid-row: 1 / 2;
			grid-column: 4;
		}

		.line-x-3 {
			display: block;
			grid-row: 1 / -1;
			grid-column: 4;
		}

		.triangle-wrapper {
			display: flex;
			grid-column: 3;
			grid-row: 1;
		}
	}

	@media (min-width: 560px) {
		.grrrid {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}

		.grrrid-mask {
			grid-column: 1 / 6;
			grid-row: 1;
		}

		.grrrid-smiley {
			grid-column: 4 / 6;
		}

		:global(.grrrid-child-0) {
			grid-column: 2;
			grid-row: 1;
		}
		:global(.grrrid-child-1) {
			grid-column: 3;
			grid-row: 1;
		}
		:global(.grrrid-child-2) {
			grid-column: 3;
			grid-row: 2;
		}
		:global(.grrrid-child-3) {
			grid-column: 4;
			grid-row: 2;
		}
		:global(.grrrid-child-4) {
			grid-column: 1;
			grid-row: 3;
		}
		:global(.grrrid-child-5) {
			grid-column: 4;
			grid-row: 3;
		}
		:global(.grrrid-child-6) {
			grid-column: 5;
			grid-row: 3;
		}
		:global(.grrrid-child-7) {
			grid-column: 6;
			grid-row: 3;
		}
		:global(.grrrid-child-8) {
			grid-column: 3;
			grid-row: 4;
		}
		:global(.grrrid-child-9) {
			grid-column: 4;
			grid-row: 4;
		}
		:global(.grrrid-child-10) {
			grid-column: 5;
			grid-row: 4;
		}
		:global(.grrrid-child-11) {
			grid-column: 5;
			grid-row: 5;
		}

		.line-y-4 {
			grid-row: 1 / 2;
			grid-column: 6;
		}

		.line-x-3 {
			grid-row: 2 / -1;
		}
		.line-x-4 {
			display: block;
			grid-column: 5;
		}
		.line-x-5 {
			display: block;
			grid-row: 1 / -1;
			grid-column: 6;
		}

		.triangle-wrapper {
			grid-column: 5;
		}
	}
</style>
