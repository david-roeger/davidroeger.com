import pg from 'pg';
import { env } from '$env/dynamic/private';
import { SUPABASE_HOST } from '$env/static/private';
import { building } from '$app/environment';

console.log('@@@ host', SUPABASE_HOST);

const client = !building
	? new pg.Pool({
			host: env.SUPABASE_HOST,
			user: env.SUPABASE_USER,
			password: env.SUPABASE_PASSWORD,
			database: env.SUPABASE_DATABASE,
			port: parseInt(env.SUPABASE_PORT)
	  })
	: ({ connect: async () => {}, query: async () => {} } as pg.Pool);

await client.connect();

export default client;
