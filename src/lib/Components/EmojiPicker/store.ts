import type { EmojiData } from './types';
import { writable } from 'svelte/store';

export const emojiData = writable<EmojiData | undefined>();
