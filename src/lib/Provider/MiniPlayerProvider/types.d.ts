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

type RegisterPlayerArgs = Omit<MiniPlayer, 'element' | 'id'> & {
	context?: string;
};

export interface MiniPlayerContext {
	registerPlayer: (args: RegisterPlayerArgs) => string;
	playPlayer: (args: { context?: string; id: string }) => void;
	removePlayer: (args: { context?: string; id: string }) => void;
}
