import Redis from 'ioredis';
import { env } from '$env/dynamic/private';

let redis: Redis;

const getClient = () => {
	if (env.REDIS === 'false')
		throw new Error(
			'redis client should only be used in production or docker'
		);
	if (!redis) {
		redis = new Redis({
			host: env.REDIS_HOST,
			port: env.REDIS_PORT ? parseInt(env.REDIS_PORT) : 6379
		});
	}

	return redis;
};

export { getClient };
