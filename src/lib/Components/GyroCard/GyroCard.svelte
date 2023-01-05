<script lang="ts">
	import { mapToRange } from '$lib/Utils';
	import { spring } from 'svelte/motion';
	import Button from '../Button/Button.svelte';
	import { requestDeviceOrientationPermission } from './utils';

	const MAX_ANGLE = 90;

	const transition = {
		stiffness: 0.1,
		damping: 0.8
	};

	let isTouching = false;
	let touchId: number;
	let initialTouch = {
		x: 0,
		y: 0
	};

	let currentTouchDistance = spring(
		{
			x: 0,
			y: 0
		},
		{
			...transition
		}
	);

	let currentAngle = spring(
		{
			x: 0,
			y: 0
		},
		{
			...transition
		}
	);

	const handleOrientation = (event: DeviceOrientationEvent) => {
		if (isTouching) return;
		const { beta, gamma } = event;
		if (!beta || !gamma) return;

		console.log(beta, gamma);

		const mappedX = mapToRange(gamma, -90, 90, -MAX_ANGLE, MAX_ANGLE);

		const mappedY = mapToRange(beta, -180, 180, MAX_ANGLE, -MAX_ANGLE);

		currentAngle.set({
			x: mappedX,
			y: mappedY
		});
	};
	const handleTouchStart = ({ touches }: TouchEvent) => {
		const touch = touches[0];
		touchId = touch.identifier;
		isTouching = true;

		initialTouch = {
			x: touch.clientX,
			y: touch.clientY
		};

		currentTouchDistance.set({
			x: 0,
			y: 0
		});
	};
	const handleTouchMove = ({ touches }: TouchEvent) => {
		const touch = Array.from(touches).find(
			(touch) => touch.identifier === touchId
		);
		if (!touch) return;

		const x = touch.clientX;
		const y = touch.clientY;

		currentTouchDistance.set({
			x: x - initialTouch.x,
			y: y - initialTouch.y
		});
	};

	const handleTouchEnd = ({ touches }: TouchEvent) => {
		const touch = Array.from(touches).find(
			(touch) => touch.identifier === touchId
		);
		if (touch) return;

		isTouching = false;

		initialTouch.x = 0;
		initialTouch.y = 0;

		currentTouchDistance.set({
			x: 0,
			y: 0
		});
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (isTouching) return;
		// calculate mouse distance from center of screen
		const x = event.clientX;
		const y = event.clientY;
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		const mappedX = mapToRange(
			x - centerX,
			-window.innerWidth / 2,
			window.innerWidth / 2,
			-MAX_ANGLE,
			MAX_ANGLE
		);

		const mappedY = mapToRange(
			y - centerY,
			-window.innerHeight / 2,
			window.innerHeight / 2,
			MAX_ANGLE,
			-MAX_ANGLE
		);

		currentAngle.set({
			x: mappedX,
			y: mappedY
		});
	};

	$: if (typeof window !== 'undefined')
		currentAngle.set({
			x: mapToRange(
				$currentTouchDistance.x,
				-window.innerWidth / 2,
				window.innerWidth / 2,
				-MAX_ANGLE,
				MAX_ANGLE
			),
			y: mapToRange(
				$currentTouchDistance.y,
				-window.innerHeight / 2,
				window.innerHeight / 2,
				MAX_ANGLE,
				-MAX_ANGLE
			)
		});
</script>

<svelte:window
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
	on:touchcancel={handleTouchEnd}
	on:mousemove={handleMouseMove}
	on:deviceorientation={handleOrientation}
/>

<Button
	on:click={() => {
		requestDeviceOrientationPermission();
	}}
>
	Request Device Orientation Permission
</Button>
<div class="touch-none" style="perspective: 1000px;">
	<div
		style="transform-style: preserve-3d;"
		style:transform="rotateY({$currentAngle.x}deg) rotateX({$currentAngle.y}deg)"
	>
		<slot />
	</div>
</div>
