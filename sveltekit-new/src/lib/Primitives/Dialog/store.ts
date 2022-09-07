import { writable } from 'svelte/store';

export const activeDialogs = writable<number[]>([]);
