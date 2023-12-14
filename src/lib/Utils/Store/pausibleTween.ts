import {} from 'svelte/easing';
import type { Tweened as NativeTweened } from 'svelte/motion';
import { tweened as nativeTweened } from 'svelte/motion';
import { get, writable, type Writable } from 'svelte/store';

interface Options<T> {
	delay?: number;
	duration: number;
	easing?: (t: number) => number;
	interpolate?: (a: T, b: T) => (t: number) => T;
}

export interface Tweened<T> extends NativeTweened<T> {
	pause: () => Promise<void>;
	paused: Writable<boolean>;
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

	const paused = writable(false);
	const pause = () => {
		paused.set(true);
		const value = get(nativeStore);
		return initialSet(value, { duration: 0 });
	};

	const reset = () => {
		paused.set(true);
		return initialSet(initial, { duration: 0 });
	};

	const resume = () => {
		paused.set(false);

		const value = get(nativeStore);
		const percentageCompleted = (value - initial) / (lastSet - initial);
		const remaining =
			options.duration - options.duration * percentageCompleted;

		return initialSet(lastSet, { duration: remaining });
	};

	const replay = async () => {
		paused.set(false);
		await reset();
		return initialSet(lastSet, options);
	};

	const set = (newValue: number, options: Options<number>) => {
		lastSet = newValue;
		return initialSet(newValue, options);
	};

	return {
		...nativeStore,
		set,
		pause,
		paused,
		reset,
		resume,
		replay
	};
};
