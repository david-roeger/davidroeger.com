import type { derived } from 'svelte/store';

type MetaData = {
	title: string;
	artist: string;
	album: string;
	artwork: {
		src: string;
		sizes: string;
		type: string;
	}[];
};

type MediaPlayerState = 'idle' | 'loading' | 'ready' | 'playing' | 'paused';

type MiniPlayer = {
	id: string;
	src: string;
	previewImage?: string;
	externalUrl: string;
	metaData: MetaData;
	element?: HTMLAudioElement;
};

type RegisterArgs = Omit<MiniPlayer, 'element' | 'id'> & {
	context?: string;
};

export interface MiniPlayerContext {
	register: (args: RegisterArgs) => string;
	play: (args: { context?: string; id: string }) => Promise<void>;
	pause: (args: { context?: string; id: string }) => void;
	remove: (args: { context?: string; id: string }) => void;
	state: derived<{
		context?: string;
		currentId?: string;
		state: MediaPlayerState;
	}>;
}
