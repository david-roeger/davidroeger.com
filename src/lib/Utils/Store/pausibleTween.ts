import { tweened as nativeTweened } from 'svelte/motion';
import type { Tweened as NativeTweened } from 'svelte/motion';
import { get } from 'svelte/store';
import {} from 'svelte/easing';

interface Options<T> {
	delay?: number;
	duration: number;
	easing?: (t: number) => number;
	interpolate?: (a: T, b: T) => (t: number) => T;
}

export interface Tweened<T> extends NativeTweened<T> {
	pause: () => Promise<void>;
	resume: () => Promise<void>;
	replay: () => Promise<void>;
	reset: () => Promise<void>;
}

export const tweened = (
	initial: number,
	options: Options<number> | undefined = { duration: 500 }
): Tweened<number> => {
	const nativeStore = nativeTweened(initial, options);

	let lastSet = initial;
	const initialSet = nativeStore.set;

	const pause = () => {
		const value = get(nativeStore);
		return initialSet(value, { duration: 0 });
	};

	const reset = () => {
		return initialSet(initial, { duration: 0 });
	};

	const resume = () => {
		const value = get(nativeStore);
		const percentageCompleted = (value - initial) / (lastSet - initial);
		const remaining =
			options.duration - options.duration * percentageCompleted;

		return initialSet(lastSet, { duration: remaining });
	};

	const replay = async () => {
		await reset();
		return initialSet(lastSet, options);
	};

	const set = (newValue: number, options: Options<number>) => {
		lastSet = newValue;
		return initialSet(newValue, options);
	};

	return {
		...nativeStore,
		pause,
		reset,
		resume,
		replay,
		set
	};
};
