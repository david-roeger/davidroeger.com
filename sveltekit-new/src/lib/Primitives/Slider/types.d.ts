import type { Writable } from 'svelte/store';

export type Direction = 'top' | 'bottom' | 'left' | 'right';
export type Size = 'width' | 'height';

export type Value = { value: number; id: string; element: HTMLElement };
export interface RootContext {
	id: string;
	disabled: boolean;
	orientation: 'horizontal' | 'vertical';
	min: number;
	max: number;
	step: number;
	activeValues: Writable<Value[]>;
	setSlider: Writable<((value: Value) => void) | undefined>;
	start: Direction;
	end: Direction;
	size: Size;
	direction: number;
	focusThumb: Writable<Value | undefined>;
	name: string;
}
