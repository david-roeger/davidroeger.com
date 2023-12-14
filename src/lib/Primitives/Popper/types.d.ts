import type { FocusTrap } from 'focus-trap';
import type { Writable } from 'svelte/store';

import { ALIGN_OPTIONS, SIDE_OPTIONS } from './constants';

export interface Rect {
	rect: DOMRect;
	onDestroy: (() => void) | undefined;
}

export interface RootContext {
	id: string;
	open: Writable<boolean>;
	trap: Writable<FocusTrap | undefined>;
	setOpen: Writable<(() => void) | undefined>;
	setClose: Writable<(() => void) | undefined>;
	triggerElement: Writable<HTMLElement | undefined>;
}

export type Axis = 'x' | 'y';
export type Side = (typeof SIDE_OPTIONS)[number];
export type Align = (typeof ALIGN_OPTIONS)[number];
export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
