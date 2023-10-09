import { tick } from 'svelte';
import {
	derived,
	type Readable,
	type Stores,
	type StoresValues
} from 'svelte/store';

export const ticked = <S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>) => T,
	initialValue?: T | undefined,
	condition: (values: StoresValues<S>) => boolean = () => true
): Readable<T> => {
	const tickFn = async (values: StoresValues<S>, set: (value: T) => void) => {
		if (condition(values)) {
			await tick();
		}

		set(fn(values));
	};

	return derived(
		stores,
		(values, set) => {
			tickFn(values, set);
		},
		initialValue
	);
};
