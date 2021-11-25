const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

import { request } from '../../../utils/request';

import { topTrack, topArtist, currentTrack, recentTrack } from '../../../types';

export const getAccessToken = async () => {
    console.log('get token');
    const { access_token, error } = await request(
        'https://accounts.spotify.com/api/token',
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(
                    SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET,
                )}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: SPOTIFY_REFRESH_TOKEN,
            }),
        },
    );
    return {
        data: access_token || '',
        error,
    };
};

const baseRequest = async (accessToken: string, params: string) => {
    const res = await request(`https://api.spotify.com/v1/me${params}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return res;
};

const getTop = async (accessToken: string, type: string, range: string) => {
    const { items, error } = await baseRequest(
        accessToken,
        `/top/${type}/?time_range=${range}_term&limit=8&offset=0`,
    );
    return {
        data: items || [],
        error,
    };
};

export const getTopTracks = async (accessToken: string, range: string) => {
    const { data, error } = await getTop(accessToken, 'tracks', range);
    return {
        data: data as topTrack[],
        error,
    };
};

export const getTopArtists = async (accessToken: string, range: string) => {
    const { data, error } = await getTop(accessToken, 'artists', range);
    return {
        data: data as topArtist[],
        error,
    };
};

const getCurrentTrack = async (accessToken: string) => {
    const { item, error } = await baseRequest(
        accessToken,
        '/player/currently-playing/?market=DE&additional_types=track',
    );
    return {
        data: ([item] || []) as currentTrack[],
        error,
    };
};

const getRecentTrack = async (accessToken: string) => {
    const { items, error } = await baseRequest(
        accessToken,
        '/player/recently-played?limit=1',
    );
    return {
        data: (items && items[0] ? [items[0].track] : []) as recentTrack[],
        error,
    };
};

export const getLastTrack = async (accessToken: string) => {
    const current = await getCurrentTrack(accessToken);
    if (current.data.length && current.data[0]) return current;

    const recent = await getRecentTrack(accessToken);
    if (recent.data.length && current.data[0]) return recent;

    if (current.error) return current;
    return recent;
};
