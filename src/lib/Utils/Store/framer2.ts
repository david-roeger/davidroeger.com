type Framer = {
	frame: number;
	interval: number;
	frameRate: number;
	setFrameRate: (value: number) => void;
};
export const createFramer = (initialFrameRate = 60) => {
	const clock = new Clock();
	let delta = 0;

	console.log('createFramer', initialFrameRate);
	const frameRateStore = writable(initialFrameRate);
	const setFrameRate = (value: number) => {
		frameRateStore.set(value);
	};

	const intervalStore = derived(
		[frameRateStore],
		([frameRateValue]) => {
			return 1 / frameRateValue;
		},
		1 / initialFrameRate
	);

	const derivedStore = derived(
		[intervalStore],
		([interval], _, update) => {
			if (!browser) return;

			update((state) => ({
				...state,
				interval,
				frameRate: get(frameRateStore)
			}));

			let animationframe: number;
			const animate = () => {
				delta += clock.getDelta();
				if (delta > interval) {
					update((state) => ({
						...state,
						frame: state.frame + 1
					}));

					delta = delta % interval;
				}
				animationframe = window.requestAnimationFrame(animate);
			};

			animationframe = window.requestAnimationFrame(animate);

			return () => window.cancelAnimationFrame(animationframe);
		},
		{
			frame: 0,
			interval: 1 / initialFrameRate,
			frameRate: initialFrameRate,
			setFrameRate
		}
	);

	return readonly<Framer>(derivedStore);
};

import { browser } from '$app/environment';
import { derived, get, writable } from 'svelte/store';
import { Clock } from 'three';
