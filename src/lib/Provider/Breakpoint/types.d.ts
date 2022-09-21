import type { Writable } from 'svelte/store';

export interface BreakpointContext {
	SM: Writable<boolean>;
	MD: Writable<boolean>;
	LG: Writable<boolean>;
	XL: Writable<boolean>;
	'2XL': Writable<boolean>;
}
