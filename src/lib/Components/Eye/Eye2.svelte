<script lang="ts">
	import { makeNoise2D } from 'open-simplex-noise';

	import { mapToRange } from '$lib/Utils';
	import { onMount } from 'svelte';
	import Svg from './Svg.svelte';

	const thresholds = [];
	for (let i = 0; i < 100; i += 1) {
		const threshold = i / 100;
		thresholds.push(threshold);
	}

	const options = {
		root: null,
		rootMargin: '0px',
		threshold: thresholds,
	};

	const noise2D = makeNoise2D(Date.now()); // Using current date as seed

	let windowHeight = 0;
	let observer;
	let eye = 0;
	let iris = { x: 23, y: 0 };

	let canvas;

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

		const ctx = canvas.getContext('2d');
		const loop = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			ctx.fillStyle = '#000';

			var p = new Path2D(`M 0 16 
		C ${32 - eye * 16} ${16 - eye * 16} ${40 + eye * 16} ${16 - eye * 16} 72 16
		C ${40 + eye * 16} ${16 + eye * 16} ${32 - eye * 16} ${16 + eye * 16} 0 16
		z`);
			ctx.stroke(p);
		};

		let frame;

		observer = new IntersectionObserver((entries) => {
			const element =
				entries.length === 4 ? entries[0] : entries[entries.length - 1];
			const progress = parseInt(
				element.target.getAttribute('data-progress'),
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
								23,
							),
							y: mapToRange(
								noise2D(intersectionRatio * 1.0, 1000),
								-1,
								1,
								-8,
								8,
							),
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
								23,
							),
							y: mapToRange(
								noise2D((intersectionRatio + 1) * 1.0, 1000),
								-1,
								1,
								-8,
								8,
							),
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
								23,
							),
							y: mapToRange(
								noise2D((intersectionRatio + 2) * 1.0, 1000),
								-1,
								1,
								-8,
								8,
							),
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
								24,
							),
							y: mapToRange(
								noise2D((intersectionRatio + 3) * 1.0, 1000),
								-1,
								1,
								-8,
								8,
							),
						};
					} else {
						eye = 0;
					}
					break;
				default:
					break;
			}

			frame = requestAnimationFrame(loop);
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
			cancelAnimationFrame(frame);
		};
	});
</script>

<div class="border-black ">
	<div class="sticky top-0 transition-all" style="height: {windowHeight}px;">
		<canvas
			width="72"
			height="32"
			bind:this={canvas}
			class="w-full h-full m-auto"
		/>
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
