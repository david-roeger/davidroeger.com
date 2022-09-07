import type { FocusTrap } from 'focus-trap';
import type { Writable } from 'svelte/store';
export interface RootContext {
	id: string;
	open: Writable<boolean>;
	trap: Writable<FocusTrap | undefined>;
	setOpen: Writable<() => void | undefined>;
	setClose: Writable<() => void | undefined>;
	computedId: number;
}
