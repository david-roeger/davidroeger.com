import { createClient } from '@supabase/supabase-js';
import {
    getAccessToken,
    getLastTrack,
    getTopArtists,
    getTopTracks,
} from './spotify';

import { ENUMS } from '../../../ENUMS';
import {
    schema,
    responseSchema,
    recentTrack,
    currentTrack,
    topTrack,
    topArtist,
    responseData,
} from '../../../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getSupabaseData = async () => {
    let { data, error } = await supabase.from('spotifydata').select();
    console.log(data);
    let lastTrack: [recentTrack[] | currentTrack[]] = [[]];
    let topTracks: [topTrack[]] = [[]];
    let topArtists: [topArtist[]] = [[]];
    if (data && data.length) {
        lastTrack = getLastTrackFromResponse(data as responseSchema[]);
        topTracks = getTopTracksFromResponse(data as responseSchema[]);
        topArtists = getTopArtistsFromResponse(data as responseSchema[]);
    }

    return {
        supabaseLastTrack: lastTrack,
        supabaseTopTracks: topTracks,
        supaBaseTopArtists: topArtists,
    };

    /*if (data && data.length === 0) {
        // fetch spotify
        const spotifyData = await getSpotifyData();

        const { data, error } = await supabase
            .from('spotifydata')
            .insert(spotifyData);

        console.log(data);
        console.log(error);
        return data;
    }
    console.error(
        `Request to Data Base went wrong (Status: ${error?.code}) (Message: ${error?.message})`,
    );
    return error;
    */
};

const getSpotifyData = async () => {
    const accessToken = await getAccessToken();
    const lastTrackSchema: schema = await getLastTrackSchema(accessToken);
    const topTrackSchemas: schema[] = await getTopTrackSchemas(accessToken);
    const topArtistSchemas: schema[] = await getTopArtistSchemas(accessToken);

    // error handling ???
    return [...topTrackSchemas, ...topArtistSchemas, lastTrackSchema];
};

const ranges: ['short', 'medium', 'long'] = ['short', 'medium', 'long'];

const getLastTrackSchema = async (accessToken: string) => {
    const lastTrack = await getLastTrack(accessToken);
    const schema: schema = getSchema(ENUMS.last, 0, lastTrack);
    return schema;
};

const getTopTrackSchemas = async (accessToken: string) => {
    const schemas: schema[] = [];
    for (const range of ranges) {
        const topTracks = await getTopTracks(accessToken, range);
        const schema: schema = getSchema(
            ENUMS.tracks,
            ENUMS.ranges[range],
            topTracks,
        );
        schemas.push(schema);
    }
    return schemas;
};

const getTopArtistSchemas = async (accessToken: string) => {
    const schemas: schema[] = [];
    for (const range of ranges) {
        const topArtists = await getTopArtists(accessToken, range);
        const schema: schema = getSchema(
            ENUMS.artists,
            ENUMS.ranges[range],
            topArtists,
        );
        schemas.push(schema);
    }
    return schemas;
};

const getSchema = (type: number, range: number, data: any[]) => {
    const schema: schema = {
        type: type,
        range: range,
        data: JSON.stringify(data),
    };
    return schema;
};

const getLastTrackFromResponse = (data: responseSchema[]) => {
    return getValueFromResponse(ENUMS.last, data) as [
        recentTrack[] | currentTrack[],
    ];
};

const getTopTracksFromResponse = (data: responseSchema[]) => {
    return getValueFromResponse(ENUMS.tracks, data) as [topTrack[]];
};

const getTopArtistsFromResponse = (data: responseSchema[]) => {
    return getValueFromResponse(ENUMS.artists, data) as [topArtist[]];
};

const getValueFromResponse = (type: number, data: responseSchema[]) => {
    const entries = data.filter((entry) => entry.type === type);
    let value: any[] = [];
    entries.forEach((entry) => {
        const parsed: any[] = JSON.parse(entry.data);
        value.push(parsed);
    });
    return value;
};
