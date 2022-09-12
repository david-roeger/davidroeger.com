<script lang="ts">
	import { makeNoise2D } from 'open-simplex-noise';

	import { mapToRange } from '$lib/Utils';
	import { onMount } from 'svelte';
	import Svg from './Svg.svelte';

	const thresholds = [];
	const MAX_TRESHOLDS = 10000;
	for (let i = 0; i < MAX_TRESHOLDS; i += 1) {
		const threshold = i / MAX_TRESHOLDS;
		thresholds.push(threshold);
	}

	const options: IntersectionObserverInit = {
		root: null,
		rootMargin: '0px',
		threshold: thresholds
	};

	const noise2D = makeNoise2D(Date.now()); // Using current date as seed

	let windowHeight = 0;
	let observer: IntersectionObserver;
	let eye = 0;
	let iris = { x: 23, y: 0 };

	let el1: HTMLDivElement;
	let el2: HTMLDivElement;
	let el3: HTMLDivElement;
	let el4: HTMLDivElement;

	onMount(() => {
		const setHeight = () => {
			windowHeight = window.innerHeight;
		};
		// window.addEventListener('resize', setHeight);
		setHeight();

		observer = new IntersectionObserver((entries) => {
			const element =
				entries.length === 4 ? entries[0] : entries[entries.length - 1];
			const progress = parseInt(
				element.target.getAttribute('data-progress') ?? ''
			);

			const { intersectionRatio } = element;
			let top = element.boundingClientRect.top;
			switch (progress) {
				case 0:
					if (top > 0) {
						eye = intersectionRatio;
						iris = {
							x: mapToRange(
								noise2D(intersectionRatio * 1.0, 100),
								-1,
								1,
								-23,
								23
							),
							y: mapToRange(
								noise2D(intersectionRatio * 1.0, 1000),
								-1,
								1,
								-8,
								8
							)
						};
					}
					break;
				case 1:
					if (top > 0) {
						eye = 1;
						iris = {
							x: mapToRange(
								noise2D((intersectionRatio + 1) * 1.0, 100),
								-1,
								1,
								-23,
								23
							),
							y: mapToRange(
								noise2D((intersectionRatio + 1) * 1.0, 1000),
								-1,
								1,
								-8,
								8
							)
						};
					}
					break;
				case 2:
					if (top > 0) {
						eye =
							intersectionRatio < 0.25
								? 1 - intersectionRatio * 4
								: intersectionRatio < 0.5
								? intersectionRatio * 4 - 1
								: 1;
						iris = {
							x: mapToRange(
								noise2D((intersectionRatio + 2) * 1.0, 100),
								-1,
								1,
								-23,
								23
							),
							y: mapToRange(
								noise2D((intersectionRatio + 2) * 1.0, 1000),
								-1,
								1,
								-8,
								8
							)
						};
					}
					break;
				case 3:
					if (top > 0) {
						eye = 1 - intersectionRatio;
						iris = {
							x: mapToRange(
								noise2D((intersectionRatio + 3) * 1.0, 100),
								-1,
								1,
								-24,
								24
							),
							y: mapToRange(
								noise2D((intersectionRatio + 3) * 1.0, 1000),
								-1,
								1,
								-8,
								8
							)
						};
					} else {
						eye = 0;
					}
					break;
				default:
					break;
			}
		}, options);

		observer.observe(el1);
		observer.observe(el2);
		observer.observe(el3);
		observer.observe(el4);

		return () => {
			window.removeEventListener('resize', setHeight);
			if (observer) {
				observer.disconnect();
			}
		};
	});
</script>

<div class="border-black ">
	<div class="sticky top-0 transition-all" style="height: {windowHeight}px;">
		<Svg viewBox={{ x: 72, y: 32 }}>
			<svg mask="url(#mask)">
				<svg x={36 - 13 + iris.x} y={16 - 13 + iris.y}>
					<circle cx="13" cy="13" r="12" fill="url(#paint0_radial)" />
					<circle
						cx="13"
						cy="13"
						r="12"
						fill="url(#paint1_radial)"
						fill-opacity="0.4"
					/>
					<mask
						id="mask0"
						mask-type="alpha"
						maskUnits="userSpaceOnUse"
						x="1"
						y="1"
						width="24"
						height="24"
					>
						<circle cx="13" cy="13" r="12" fill="white" />
					</mask>
					<g mask="url(#mask0)">
						<rect
							x="7.16901"
							y="23.8243"
							width="28.6812"
							height="26.2505"
							transform="rotate(-56.5217 7.16901 23.8243)"
							fill="url(#paint2_radial)"
						/>
					</g>
					<circle
						cx="13"
						cy="13"
						r="12"
						fill="url(#paint3_radial)"
						fill-opacity="0.4"
					/>
					<circle cx="13" cy="13" r="12.5" stroke="black" />
					<defs>
						<radialGradient
							id="paint0_radial"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(15.3239 10.7183) rotate(99.2423) scale(14.4695)"
						>
							<stop stop-color="#60A5FA" />
							<stop offset="1" stop-color="#F472B6" />
						</radialGradient>
						<radialGradient
							id="paint1_radial"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(8.43662 6.40845) rotate(60.5646) scale(13.5846)"
						>
							<stop stop-color="#5B21B6" />
							<stop
								offset="1"
								stop-color="white"
								stop-opacity="0"
							/>
						</radialGradient>
						<radialGradient
							id="paint2_radial"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(21.5096 36.9495) rotate(90) scale(13.1253 14.4391)"
						>
							<stop stop-color="#FBBF24" />
							<stop
								offset="1"
								stop-color="#FBBF24"
								stop-opacity="0"
							/>
						</radialGradient>
						<radialGradient
							id="paint3_radial"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(13 13) rotate(90) scale(12)"
						>
							<stop stop-color="white" stop-opacity="0" />
							<stop offset="1" stop-color="#5B21B6" />
						</radialGradient>
					</defs>
				</svg>
			</svg>

			<!-- outline-->
			<use href="#eye" />

			<!-- outline def-->
			<defs>
				<path
					id="eye"
					d={`M 0 16 
      C ${32 - eye * 16} ${16 - eye * 16} ${40 + eye * 16} ${
						16 - eye * 16
					} 72 16
      C ${40 + eye * 16} ${16 + eye * 16} ${32 - eye * 16} ${16 + eye * 16} 0 16
       z`}
					stroke="black"
				/>
				<mask id="mask">
					<use href="#eye" stroke="0" fill="white" />
				</mask>
			</defs>
		</Svg>
	</div>
	<div
		data-progress="0"
		class="bg-mauve-4"
		style="height: {windowHeight}px"
		bind:this={el1}
	/>
	<div
		data-progress="1"
		class="bg-mauve-6"
		style="height: {windowHeight}px"
		bind:this={el2}
	/>
	<div
		data-progress="2"
		class="bg-mauve-8"
		style="height: {windowHeight}px"
		bind:this={el3}
	/>
	<div
		data-progress="3"
		class="bg-mauve-10"
		style="height: {windowHeight}px; marginBottom: {-windowHeight / 2 +
			24}px"
		bind:this={el4}
	/>
	<div class="bg-purple-6" style="height: {windowHeight}px;" />
</div>
