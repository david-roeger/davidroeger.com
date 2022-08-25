import type { Dream } from '$lib/types';
import { writable } from 'svelte/store';

export const sessionDreams = writable<Dream[]>([]);
