/**
 * Spotify Types
 */
type ExternalUrls = {
	spotify: string;
};

type BaseObject = {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
};

export type Image = {
	height: number;
	url: string;
	width: number;
};

interface Album extends BaseObject {
	album_type: string;
	artists: BaseObject[];
	available_markets: string[];
	images: Image[];
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
}

export interface TopTrack extends BaseObject {
	album: Album;
	artists: BaseObject[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
		isrc: string;
	};
	external_urls: ExternalUrls;
	is_local: false;
	popularity: number;
	preview_url?: string;
	track_number: number;
}

export interface TopArtist extends BaseObject {
	followers: {
		href: string | null;
		total: number;
	};
	genres: string[];
	images: Image[];
	popularity: number;
}

export interface CurrentTrack extends TopTrack {
	is_playable: true;
}

export type RecentTrack = TopTrack;

export type LastTrack = CurrentTrack | RecentTrack;
