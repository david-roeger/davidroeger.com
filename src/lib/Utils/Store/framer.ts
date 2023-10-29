import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import { Clock } from 'three';

export const createFramer = (initialFrameRate = 60, play = false) => {
	const clock = new Clock();
	let delta = 0;

	const state = writable({
		frame: 1,
		frameRate: initialFrameRate,
		playing: browser && play
	});

	const frameRateStore = writable(initialFrameRate);

	frameRateStore.subscribe((value) => {
		state.update((s) => ({ ...s, frameRate: value }));
	});

	let animationframe: number | undefined;
	const animate = () => {
		delta += clock.getDelta();
		const frameRate = get(frameRateStore);
		const interval = 1 / frameRate;
		if (delta > interval) {
			state.update((s) => ({ ...s, frame: s.frame + 1 }));
			delta = delta % interval;
		}
		animationframe = window.requestAnimationFrame(animate);
	};

	if (browser && play) {
		animationframe = window.requestAnimationFrame(animate);
	}

	return {
		setFrameRate: (value: number) => {
			frameRateStore.set(value);
		},
		pause: () => {
			if (browser && animationframe) {
				window.cancelAnimationFrame(animationframe);
				animationframe = undefined;
				state.update((s) => ({ ...s, playing: false }));
			}
		},
		play: () => {
			if (browser && !animationframe) {
				animationframe = window.requestAnimationFrame(animate);
				state.update((s) => ({ ...s, playing: true }));
			}
		},
		/**
		 *
		 * Pushes a frame, regardless of the frame rate. Useful for when you want to
		 * update the frame manually, for example after a user interaction.
		 *
		 * @param resetDeltaForNextFrame default false - if true, the delta will be reset to 0
		 * and the next frame will be pushed according to the frame rate.
		 */
		pushFrame: (resetDeltaForNextFrame = false) => {
			if (browser) {
				state.update((s) => ({ ...s, frame: s.frame + 1 }));
				if (resetDeltaForNextFrame) {
					delta = 0;
				}
			}
		},

		subscribe: state.subscribe,
		unsubscribe: () => {
			if (browser && animationframe) {
				window.cancelAnimationFrame(animationframe);
			}
		}
	};
};
