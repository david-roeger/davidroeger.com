export interface RootContext {
	id: string;
	type: 'single' | 'multiple';
	disabled: boolean;
	collapsible: boolean;
	activeValues: Writable<string[]>;
}

export interface ItemContext {
	id: string;
	active: Readable<boolean>;
	disabled: boolean;
	value: string;
	dataState: Readable<'open' | 'closed'>;
}
