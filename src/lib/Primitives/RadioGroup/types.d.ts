import type { Writable } from 'svelte/store';
export interface RootContext {
	id: string;
	name: string;
	orientation: 'horizontal' | 'vertical';
	activationMode: 'automatic' | 'manual';
	required: boolean;
	activeValue: Writable<string>;
	setRadio: Writable<(value: string) => void | undefined>;
}
