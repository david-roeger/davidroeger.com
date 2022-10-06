console.info('hooks: hooks.server.ts');

import { dev, prerendering } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

// in-memory cache for server responses
const CACHE = new Map<string, Record<string, string>>();

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
	const { url } = event;

	if (prerendering) {
		return resolve(event);
	}

	const ROUTE_CONFIG = CACHABLE_ROUTES_CONFIG.find(
		(route) => route.path === url.pathname
	);

	if (!ROUTE_CONFIG) {
		return resolve(event);
	}

	const key = `${url.origin}${url.pathname}${
		ROUTE_CONFIG.useSearchParams ? url.search : ''
	}`;

	// ideally this is the only network request that
	// we make ... it will return an empty object if
	// the page wasn't cached or a populated object
	// containing body and headers

	let cached = CACHE.get(key);
	console.info(`hooks: CACHE // ${key} : ${cached ? 'HIT' : 'MISS'}`);
	if (
		!cached ||
		!cached.body ||
		(cached.expires && parseInt(cached.expires) < Date.now())
	) {
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
			if (ROUTE_CONFIG.expires) {
				cached.expires = (
					Date.now() +
					ROUTE_CONFIG.expires * 1000
				).toString();
			}
			console.info(`hooks: CACHE // ${key} : ADDED`);
			CACHE.set(key, cached);
		}
	}

	delete cached.expires;

	// we end up here with the same object whether
	// it came from the cache or was rendered fresh
	// and we just return it as the response
	const { body, ...headers } = cached;
	return new Response(body, { headers: new Headers(headers) });
};
