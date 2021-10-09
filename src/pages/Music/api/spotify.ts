const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

import { request } from '../../../utils/request';

import { topTrack, topArtist, currentTrack, recentTrack } from './types';

export const getAccessToken = async () => {
    const { access_token } = await request(
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
    if (access_token) return access_token as string;
    return '';
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

const getTop = async (accessToken: string, type: string) => {
    const { items } = await baseRequest(
        accessToken,
        `/top/${type}/?time_range=medium_term&limit=10&offset=0`,
    );
    if (items) return items as any[];
    return [];
};

export const getTopTracks = async (accessToken: string) => {
    return (await getTop(accessToken, 'tracks')) as topTrack[];
};

export const getTopArtists = async (accessToken: string) => {
    return (await getTop(accessToken, 'artists')) as topArtist[];
};

const getCurrentTrack = async (accessToken: string) => {
    const { item } = await baseRequest(
        accessToken,
        '/player/currently-playing/?market=DE&additional_types=track',
    );
    if (item) return [item] as currentTrack[];
    return [];
};

const getRecentTrack = async (accessToken: string) => {
    const { items } = await baseRequest(
        accessToken,
        '/player/recently-played?limit=1',
    );
    if (items && items[0]) return [items[0].track] as recentTrack[];
    return [];
};

export const getLastTrack = async (accessToken: string) => {
    const current = await getCurrentTrack(accessToken);
    console.log(current);
    if (current.length) return current;

    const recent = await getRecentTrack(accessToken);
    console.log(recent);
    if (recent.length) return recent;

    return [];
};
