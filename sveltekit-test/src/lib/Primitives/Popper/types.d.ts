import type { FocusTrap } from 'focus-trap';
import type { Writable } from 'svelte/store';

export interface RootContext {
	id: string;
	open: Writable<boolean>;
	trap: Writable<FocusTrap | undefined>;
	setOpen: Writable<() => void | undefined>;
	setClose: Writable<() => void | undefined>;
	triggerElement: Writable<HTMLElement | undefined>;
	contentElement: Writable<HTMLElement | undefined>;
	popperOptions: Writable<Options | undefined>;
}

export type Placement =
	| 'auto'
	| 'auto-start'
	| 'auto-end'
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'left'
	| 'left-start'
	| 'left-end';

export type Strategy = 'absolute' | 'fixed';

export type Options = {
	placement?: Placement;
	strategy?: Strategy;
	modifiers?: [
		{
			name: 'offset';
			options: {
				offset: [number, number];
			};
		}
	];
};
