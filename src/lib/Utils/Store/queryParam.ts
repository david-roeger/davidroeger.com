import { browser } from '$app/environment';
import { page } from '$app/stores';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { replaceStateWithQuery } from '..';

// eslint-disable-next-line @typescript-eslint/no-empty-function

export type EncodeAndDecodeOptions<T = unknown> = {
	encode?: (value: T) => string;
	decode?: (value: string | null) => T | null;
	defaultValue?: T;
};
export type StoreOptions = {
	debounceHistory?: number;
	pushHistory?: boolean;
	shallow?: boolean;
};

export function queryParam<T = string>(
	name: string,
	{ encode, decode, defaultValue }: EncodeAndDecodeOptions<T>
): Writable<T | null> {
	const { set, subscribe, update } = writable<T | null>();

	const unsubPage = page.subscribe(($page) => {
		const hasActualParam = $page?.url?.searchParams?.has?.(name);
		const actualParam = $page?.url?.searchParams?.get?.(name);
		// if (!browser) return;
		if (hasActualParam && defaultValue !== undefined) {
			set(defaultValue);
		} else {
			if (decode) {
				set(decode(actualParam));
			} else {
				set(actualParam as T | null);
			}
		}
	});
	const sub: Writable<T | null>['subscribe'] = (...props) => {
		const unsub = subscribe(...props);
		return () => {
			unsub();
			unsubPage();
		};
	};
	return {
		set: (value) => {
			if (!browser) return;
			if (encode) {
				const encoded = value !== null ? encode(value) : '';
				replaceStateWithQuery({ [name]: encoded });
			} else {
				replaceStateWithQuery({ [name]: value as string });
			}
			set(value);
		},
		subscribe: sub,
		update: (fn) => {
			if (!browser) return;
			update((value) => {
				const newValue = fn(value);
				if (encode) {
					const encoded = newValue !== null ? encode(newValue) : '';
					replaceStateWithQuery({ [name]: encoded });
				} else {
					replaceStateWithQuery({ [name]: newValue as string });
				}
				return newValue;
			});
		}
	};
}
