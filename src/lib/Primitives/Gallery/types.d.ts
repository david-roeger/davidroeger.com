import type { Writable } from 'svelte/store';

export interface RootContext {
	id: string;
	direction: 'horizontal' | 'vertical';
	setGallery: Writable<(value: number) => void | undefined>;
	container: writable<HTMLDivElement | undefined>;
	step: number;
	computedStep: writable<number | undefined>;
	end: writable<boolean | undefined>;
	start: writable<boolean | undefined>;
}
