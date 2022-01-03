import type { Writable } from 'svelte/store';
export interface RootContext {
	id: string;
	disabled: boolean;
	activeValues: Writable<string[]>;
	setAccordion: Writable<(value: string, active: boolean) => void | undefined>;
}

export interface ItemContext {
	id: string;
	active: Readable<boolean>;
	disabled: boolean;
	value: string;
	dataState: Readable<'open' | 'closed'>;
}
