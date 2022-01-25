import type { Writable } from 'svelte/store';
export interface RootContext {
    id: string;
    direction: 'horizontal' | 'vertical';
    activationMode: 'automatic' | 'manual';
    activeValue: Writable<string>;
    setTabs: Writable<(value: string) => void | undefined>;
}
