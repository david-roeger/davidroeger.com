import type { Writable } from 'svelte/store';

export interface RootContext {
	id: string;
	disabled: boolean;
	checked: Writable<boolean>;
}
