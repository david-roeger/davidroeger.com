import pg from 'pg';
import { env } from '$env/dynamic/private';

const client = new pg.Client(env.SUPABASE_CONNECTION_STRING);
await client.connect();

export default client;
