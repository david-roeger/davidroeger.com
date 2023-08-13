import { writable } from 'svelte/store';

export const activePlayer = writable<HTMLAudioElement | null>(null);
