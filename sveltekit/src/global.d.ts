/// <reference types="@sveltejs/kit" />

/**
 * Spotify Types
 */

enum spotifyData {
    last = 0,
    tracks = 1,
    artists = 2,
    ranges = {
        short = 0,
        medium = 1,
        long = 2,
    },
}

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

interface topTrack extends baseObject {
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

interface currentTrack extends topTrack {
    is_playable: true;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface recentTrack extends topTrack {}

interface topArtist extends baseObject {
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
interface schema {
    type: number;
    range: number;
    data: string;
}

interface responseSchema {
    type: number;
    range: number;
    data: string;
    inserted_at: string;
    updated_at: string;
}

interface responseData {
    supabaseLastTrack: (currentTrack[] | recentTrack[])[];
    supabaseTopTracks: topTrack[][];
    supaBaseTopArtists: topArtist[][];
}

/**
 * Provider Types
 */

interface breakpointBaseObject {
    DEFAULT: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
    '2xl': boolean;
}

interface breakpointValue {
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

interface keyBoolean {
    [key: string]: boolean;
}

interface keyNumber {
    [key: string]: number;
}

interface keyAny {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

enum status {
    idle = 'idle',
    pending = 'pending',
    resolved = 'resolved',
    rejected = 'rejected',
}

interface asyncState {
    status: status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
}
