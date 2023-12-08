<script lang="ts">
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
		<svg
			class="stacked"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				x="4"
				y="11.5"
				width="15"
				height="1"
				rx="0.5"
				fill="currentColor"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M19.3137 12.7176L20.0208 12.0105L20.0208 12.0104L19.3137 11.3033L19.3137 11.3034L14.3639 6.35361C14.1686 6.15835 13.8521 6.15835 13.6568 6.35361C13.4615 6.54887 13.4615 6.86545 13.6568 7.06071L18.6065 12.0105L13.6569 16.9602C13.4616 17.1554 13.4616 17.472 13.6569 17.6673C13.8521 17.8625 14.1687 17.8625 14.364 17.6673L19.3137 12.7176Z"
				fill="currentColor"
			/>
		</svg>
	</span>
	<span
		class="face side {CUBE_COLOR_CLASSES[variant].side} {CUBE_COLOR_CLASSES[
			variant
		].arrow}"
	>
		<svg
			class="stacked {CUBE_COLOR_CLASSES[variant].arrow}"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				x="4"
				y="11.5"
				width="15"
				height="1"
				rx="0.5"
				fill="currentColor"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M19.3137 12.7176L20.0208 12.0105L20.0208 12.0104L19.3137 11.3033L19.3137 11.3034L14.3639 6.35361C14.1686 6.15835 13.8521 6.15835 13.6568 6.35361C13.4615 6.54887 13.4615 6.86545 13.6568 7.06071L18.6065 12.0105L13.6569 16.9602C13.4616 17.1554 13.4616 17.472 13.6569 17.6673C13.8521 17.8625 14.1687 17.8625 14.364 17.6673L19.3137 12.7176Z"
				fill="currentColor"
			/>
		</svg>
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

	.face svg {
		width: 100%;
		height: 100%;
	}

	.side {
		transform: translate(-100%) rotateY(-90deg);
		transform-origin: top right;
	}
</style>
