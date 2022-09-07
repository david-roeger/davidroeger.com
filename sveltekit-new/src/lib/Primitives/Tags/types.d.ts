import type { Writable } from 'svelte/store';
export interface RootContext {
	id: string;
	activeValues: Writable<string[]>;
	setTags: Writable<((value: string) => void) | undefined>;
	unsetTags: Writable<(() => void) | undefined>;
}
