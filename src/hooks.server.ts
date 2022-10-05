console.info('hooks: hooks.server.ts');

import { dev, prerendering } from '$app/environment';
import redis from '$utils/redis';
import type { Handle } from '@sveltejs/kit';

const CACHABLE_ROUTES_CONFIG = [
	{
		path: '/about/music',
		useSearchParams: false,
		expires: 60 * 60 * 24 * 7 // 1 week in seconds
	},
	{
		path: '/projects',
		useSearchParams: true
	}
];

export const handle: Handle = async ({ event, resolve }) => {
	console.info('hooks: hooks.server.ts // handle');

	const { url } = event;

	if (prerendering || !redis) {
		return resolve(event);
	}

	const ROUTE_CONFIG = CACHABLE_ROUTES_CONFIG.find(
		(route) => route.path === url.pathname
	);

	if (!ROUTE_CONFIG) {
		return resolve(event);
	}

	// Create a unique key to store the page in the
	// cache. I'm using "rendered" to differentiate
	// entries from other data in Redis and the "v1"
	// will allow invalidating the entire cache if
	// the application code will change rendering.
	// For a blog, I don't want to alter the cache
	// on every querystring parameter otherwise it
	// reduces the cache hit-rate due to parameters
	// other sites may add (such as "fbclid").
	const key = `${process.env.VITE_APP_VERSION}_:_${url.origin}${
		url.pathname
	}${ROUTE_CONFIG.useSearchParams ? url.search : ''}`;

	// ideally this is the only network request that
	// we make ... it will return an empty object if
	// the page wasn't cached or a populated object
	// containing body and headers
	try {
		let cached = await redis.hgetall(key);
		console.info(
			`hooks: CACHE // ${key} : ${cached.body ? 'HIT' : 'MISS'}`
		);
		if (!cached.body) {
			// if it wasn't cached, we render the pages
			const response = await resolve(event);

			// then convert it into a cachable object
			cached = Object.fromEntries(response.headers.entries());
			cached.body = await response.text();

			if (response.status === 200) {
				// and write it to the Redis cache ...
				// NOTE: although this returns a promise
				// we don't await it, so we don't delay
				// returning the response to the client
				// (the cache write is "fire and forget")
				redis.hset(key, cached).then(() => {
					console.info(`hooks: NEW KEY // ${key}}`); // ... and set an expiry if one was
					// specified in the config
					if (ROUTE_CONFIG.expires) {
						console.info(
							`hooks: KEY EXPIRES // ${key}} // ${ROUTE_CONFIG.expires}`
						);
						redis.expire(key, ROUTE_CONFIG.expires);
					}
				});
			}
		}

		// we end up here with the same object whether
		// it came from the cache or was rendered fresh
		// and we just return it as the response
		const { body, ...headers } = cached;
		return new Response(body, { headers: new Headers(headers) });
	} catch (error) {
		console.error('Failed to connect to Redis', error);
		return resolve(event);
	}
};
