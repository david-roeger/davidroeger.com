import type { Writable } from 'svelte/store';

export interface RootContext {
	min: number;
	max: number;
	value: Writable<number>;
}
