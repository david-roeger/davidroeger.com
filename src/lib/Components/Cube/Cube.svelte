<script lang="ts">
	import East from '$assets/Icons/24/east.svg?component';
	import type { Colors } from '$utils/colors';
	import { CUBE_COLOR_CLASSES } from './constants';

	export let variant: Colors = 'default';
</script>

<span class="cube group/cube">
	<span
		class="face {CUBE_COLOR_CLASSES[variant].front} {CUBE_COLOR_CLASSES[
			variant
		].arrow}"
	>
		<East />
	</span>
	<span
		class="face side {CUBE_COLOR_CLASSES[variant].side} {CUBE_COLOR_CLASSES[
			variant
		].arrow}"
	>
		<East />
	</span>
</span>

<style>
	.cube {
		aspect-ratio: 1 / 1;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;

		--perspective: 400px;
		display: grid;

		position: relative;
		transform: perspective(var(--perspective));
		transform-origin: center left;
		transform-style: preserve-3d;
		transition: transform 0.4s var(--ease-quart);
	}

	:global(.group\/cube-selector):hover .cube,
	.cube:hover {
		transform: perspective(var(--perspective)) translate(100%)
			rotateY(90deg) translateZ(0);
		--color: var(--side-color-hover);
	}

	.face {
		display: block;
		grid-area: 1 / -1 / 1 / -1;
		height: 100%;
		transform-style: preserve-3d;
		transition:
			background-color 0.4s var(--ease-quart),
			transform 0.4s var(--ease-quart);
		width: 100%;
	}

	.face :global(svg) {
		width: 100%;
		height: 100%;
	}

	.side {
		transform: translate(-100%) rotateY(-90deg);
		transform-origin: top right;
	}
</style>
