import type { FocusTrap } from 'focus-trap';
import type { Writable } from 'svelte/store';

import { SIDE_OPTIONS, ALIGN_OPTIONS } from './constants';
export interface RootContext {
    id: string;
    open: Writable<boolean>;
    trap: Writable<FocusTrap | undefined>;
    setOpen: Writable<() => void | undefined>;
    setClose: Writable<() => void | undefined>;
    triggerElement: Writable<HTMLElement | undefined>;
    contentElement: Writable<HTMLElement | undefined>;
    contentStyles: Writable<string>;
    popperOptions: Writable<{
        side: Side;
        sideOffset: number;
        align: Align;
        alignOffset: number;
        shouldAvoidCollisions: boolean;
        collisionBoundariesRect: DOMRect;
        collisionTolerance: number;
    }>;
}

export type Axis = 'x' | 'y';
export type Side = typeof SIDE_OPTIONS[number];
export type Align = typeof ALIGN_OPTIONS[number];
export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
