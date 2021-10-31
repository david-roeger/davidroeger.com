import React from 'react';
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
    recentTrack,
    currentTrack,
    topTrack,
    topArtist,
    responseData,
    responseSchema,
    asyncState,
    status,
} from '../../../types';

const time = [86400000, 604800000, 2629746000];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let spotifyAccessToken: string = '';

interface supabaseAsyncState extends asyncState {
    promise: Promise<responseSchema> | undefined;
}

const supabaseDataState: supabaseAsyncState = {
    status: status.idle,
    data: undefined,
    error: undefined,
    promise: undefined,
};

const getSupabaseData = async (): Promise<responseSchema> => {
    supabaseDataState.status = status.pending;
    let { data, error } = await supabase.from('spotifydata').select();
    if (data && data.length) {
        supabaseDataState.data = await handleSupabaseData(
            data as responseSchema[],
        );
        supabaseDataState.status = status.resolved;
        return supabaseDataState.data;
    }

    if (data && data.length === 0) {
        // fetch spotify
        const initialSpotifyData = await getInitialSpotifyData();
        if (initialSpotifyData.error) {
            supabaseDataState.error = initialSpotifyData.error;
            supabaseDataState.status = status.rejected;
            return supabaseDataState.data;
        }
        if (!initialSpotifyData.data || initialSpotifyData.data.length === 0) {
            supabaseDataState.error = initialSpotifyData.error;
            supabaseDataState.status = status.rejected;
            return supabaseDataState.data;
        }

        const { data, error } = await supabase
            .from('spotifydata')
            .insert(initialSpotifyData.data);

        if (data && data.length) {
            supabaseDataState.data = await handleSupabaseData(
                data as responseSchema[],
            );
            supabaseDataState.status = status.resolved;
            return supabaseDataState.data;
        }
        if (error) {
            supabaseDataState.error = error;
            supabaseDataState.status = status.rejected;
        }
    }

    if (error) {
        supabaseDataState.error = error;
        supabaseDataState.status = status.rejected;
    }

    return supabaseDataState.data;

    /*
    console.error(
        `Request to Data Base went wrong (Status: ${error?.code}) (Message: ${error?.message})`,
    );
    return error;
    */
};

const handleSupabaseData = async (
    data: responseSchema[],
): Promise<responseData> => {
    const lastTrackSchema = getLastTrackFromResponse(data);
    const topTracksSchema = getTopTracksFromResponse(data);
    const topArtistsSchemas = getTopArtistsFromResponse(data);

    const updatedLastTrackSchemas = await updateData(
        lastTrackSchema,
        ENUMS.last,
        true,
        getLastTrack,
        getLastTrackFromResponse,
    );

    const updatedTopTrackSchemas = await updateData(
        topTracksSchema,
        ENUMS.tracks,
        false,
        getTopTracks,
        getTopTracksFromResponse,
    );
    const updatedTopArtistsSchemas = await updateData(
        topArtistsSchemas,
        ENUMS.artists,
        false,
        getTopArtists,
        getTopArtistsFromResponse,
    );
    const parsedLastTrack = parseData(updatedLastTrackSchemas) as (
        | currentTrack[]
        | recentTrack[]
    )[];

    const parsedTopTracks = parseData(updatedTopTrackSchemas) as topTrack[][];
    const parsedTopArtists = parseData(
        updatedTopArtistsSchemas,
    ) as topArtist[][];
    return {
        supabaseLastTrack: parsedLastTrack,
        supabaseTopTracks: parsedTopTracks,
        supaBaseTopArtists: parsedTopArtists,
    };
};

// todo: add error handling
const updateData = async (
    responseSchemas: responseSchema[],
    type: number,
    isLastTrack: boolean,
    getSpotify: (a: string, b?: any) => any,
    getDataFromResponse: (a: [responseSchema]) => responseSchema[],
) => {
    const updatedResponseSchemas = [...responseSchemas];
    for (let i = 0; i < updatedResponseSchemas.length; i++) {
        let schema = updatedResponseSchemas[i];
        const difference = isLastTrack ? 60000 * 5 : time[i];
        if (compareDates(schema.updated_at, difference)) {
            console.log(new Date(Date.parse(schema.updated_at)));

            if (!spotifyAccessToken) {
                const { data, error } = await getAccessToken();
                if (error || !data) continue;
                spotifyAccessToken = data;
            }

            const spotifyData = isLastTrack
                ? await getSpotify(spotifyAccessToken)
                : await getSpotify(spotifyAccessToken, ranges[i]);

            if (spotifyData.error) {
                continue;
            }
            if (!spotifyData.data || spotifyData.data.length === 0) {
                continue;
            }

            const { data } = await supabase
                .from('spotifydata')
                .update({
                    data: JSON.stringify(spotifyData.data),
                })
                .match({ type: type, range: i });
            if (data && data.length) {
                console.log(
                    new Date(
                        Date.parse(
                            getDataFromResponse(data as [responseSchema])[0]
                                .updated_at,
                        ),
                    ),
                );
                updatedResponseSchemas[i] = getDataFromResponse(
                    data as [responseSchema],
                )[0];
                console.log(
                    new Date(Date.parse(updatedResponseSchemas[i].updated_at)),
                );
            }
        }
    }

    return updatedResponseSchemas;
};

const compareDates = (timeString: string, difference: number) => {
    const now = Date.now();
    const parsedTimeString = Date.parse(timeString);
    return now - parsedTimeString > difference;
};

const parseData = (responseSchemas: responseSchema[]) => {
    const parsed: any[][] = [];
    responseSchemas.forEach((schema) => {
        const data: any[] = JSON.parse(schema.data);
        parsed.push(data);
    });

    if (!parsed.length) parsed.push([]);
    return parsed;
};

const getInitialSpotifyData = async () => {
    if (!spotifyAccessToken) {
        const { data, error } = await getAccessToken();
        if (error) return { error };
        if (!data) return { data: [] };
        spotifyAccessToken = data;
    }

    const lastTrackSchema: schema = await getLastTrackSchema(
        spotifyAccessToken,
    );
    const topTrackSchemas: schema[] = await getTopTrackSchemas(
        spotifyAccessToken,
    );
    const topArtistSchemas: schema[] = await getTopArtistSchemas(
        spotifyAccessToken,
    );
    return {
        data: [...topTrackSchemas, ...topArtistSchemas, lastTrackSchema],
    };
};

const ranges: ['short', 'medium', 'long'] = ['short', 'medium', 'long'];

const getLastTrackSchema = async (accessToken: string) => {
    const lastTrack = await getLastTrack(accessToken);
    const schema: schema = getSchema(ENUMS.last, 0, lastTrack.data);
    return schema;
};

const getTopTrackSchemas = async (accessToken: string) => {
    const schemas: schema[] = [];
    for (const range of ranges) {
        const topTracks = await getTopTracks(accessToken, range);
        const schema: schema = getSchema(
            ENUMS.tracks,
            ENUMS.ranges[range],
            topTracks.data,
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
            topArtists.data,
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
    return getValueFromResponse(ENUMS.last, data);
};

const getTopTracksFromResponse = (data: responseSchema[]) => {
    return getValueFromResponse(ENUMS.tracks, data);
};

const getTopArtistsFromResponse = (data: responseSchema[]) => {
    return getValueFromResponse(ENUMS.artists, data);
};

const getValueFromResponse = (type: number, data: responseSchema[]) => {
    return data.filter((entry) => entry.type === type);
};

/*** */

export const getSupabaseLastTrack = async (): Promise<
    (currentTrack[] | recentTrack[])[]
> => {
    return await supabasePromiseHelper('supabaseLastTrack');
};

export const getSupabaseTopTracks = async (): Promise<topTrack[][]> => {
    return (await supabasePromiseHelper('supabaseTopTracks')) as topTrack[][];
};

export const getSupabaseTopArtists = async (): Promise<any> => {
    return await supabasePromiseHelper('supaBaseTopArtists');
};

const supabasePromiseHelper = async (key: any): Promise<any> => {
    if (supabaseDataState.status === status.idle) {
        supabaseDataState.promise = getSupabaseData();
        await supabaseDataState.promise;
    }
    if (supabaseDataState.status === status.pending) {
        if (supabaseDataState.promise) {
            await supabaseDataState.promise;
        }
    }
    if (supabaseDataState.status === status.rejected) {
        throw supabaseDataState.error;
    }
    return supabaseDataState.data[key];
};
