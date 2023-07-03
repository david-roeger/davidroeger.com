import pg from 'pg';
import { env } from '$env/dynamic/private';

const client = new pg.Client({
    host: env.SUPABASE_HOST,
    user: env.SUPABASE_USER,
    password: env.SUPABASE_PASSWORD,
    database: env.SUPABASE_DATABASE,
  });

await client.connect();

export default client;
