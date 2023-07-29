import pg, { type Pool } from 'pg';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

let client: Pool;
if (!building) {
	client = new pg.Pool({
		host: env.POSTGRES_HOST,
		user: env.POSTGRES_USER,
		password: env.POSTGRES_PASSWORD,
		database: env.POSTGRES_DB,
		port: parseInt(env.DB_PORT)
	});

	await client.connect();
}

// @ts-expect-error - https://kit.svelte.dev/docs/building-your-app#during-the-build
export default client;
