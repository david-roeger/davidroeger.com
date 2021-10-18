/**
 * Spotify Types
 */
interface externalUrls {
    spotify: string;
}

interface baseObject {
    external_urls: externalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

interface image {
    height: number;
    url: string;
    width: number;
}

interface album extends baseObject {
    album_type: string;
    artists: [baseObject];
    available_markets: [string];
    images: [image];
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
}

export interface topTrack extends baseObject {
    album: album;
    artists: [baseObject];
    available_markets: [string];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc: string;
    };
    external_urls: externalUrls;
    is_local: false;
    popularity: number;
    preview_url: string;
    track_number: number;
}

export interface currentTrack extends topTrack {
    is_playable: true;
}

export interface recentTrack extends topTrack {}

export interface topArtist extends baseObject {
    followers: {
        href: string | null;
        total: number;
    };
    genres: [string];
    images: [image];
    popularity: number;
}

/**
 * Supabase Types
 */
export interface schema {
    type: number;
    range: number;
    data: string;
}

export interface responseSchema {
    type: number;
    range: number;
    data: string;
    inserted_at: string;
    updated_at: string;
}

export interface responseData {
    supabaseLastTrack: (currentTrack[] | recentTrack[])[];
    supabaseTopTracks: topTracks[][];
    supaBaseTopArtists: topArtist[][];
}

/**
 * Provider Types
 */

export interface breakpointBaseObject {
    DEFAULT: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
    '2xl': boolean;
}

export interface breakpointValue {
    width: number;
    height: number;
    breakpoint: breakpointBaseObject;
    exact: breakpointBaseObject;
    custom: {
        breakpoint?: {
            [key: string]: boolean;
        };
        exact?: {
            [key: string]: boolean;
        };
    };
}

/**
 * Utils
 */

export interface keyBoolean {
    [key: string]: boolean;
}

export interface keyNumber {
    [key: string]: number;
}

export interface keyAny {
    [key: string]: any;
}
