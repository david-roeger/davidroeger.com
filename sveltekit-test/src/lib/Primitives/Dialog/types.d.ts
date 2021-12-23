import type { FocusTrap } from 'focus-trap';

export interface RootContext {
	id: string;
	open: Writable<boolean>;
	trap: Writable<FocusTrap | undefined>;
	setOpen: Writable<() => void | undefined>;
	setClose: Writable<() => void | undefined>;
}
