import pg from 'pg';
import { env } from '$env/dynamic/private';

console.log('@@@ host', env.SUPABASE_HOST);
const client = new pg.Client({
	host: env.SUPABASE_HOST,
	user: env.SUPABASE_USER,
	password: env.SUPABASE_PASSWORD,
	database: env.SUPABASE_DATABASE,
	port: parseInt(env.SUPABASE_PORT)
});

await client.connect();

export default client;
