import { building, version } from '$app/environment';
import { env } from '$env/dynamic/private';
import { logger } from '$lib/Utils';
import { getClient } from '$lib/Utils/Redis';
import type { Handle } from '@sveltejs/kit';

import { JSDOM } from 'jsdom';

const collectPortals = (html: string) => {
	const dom = new JSDOM(html);
	const { window } = dom;
	const portals = window.document.querySelectorAll('div[data-ssr-portal]');
	const target = window.document.querySelector('#portal');
	if (portals.length === 0 || !target) return html;

	portals.forEach((portal) => {
		target.appendChild(portal);
	});
	return dom.serialize();
};

const portalHandle = async ({ event, resolve }: Parameters<Handle>[0]) => {
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return collectPortals(html);
		}
	});

	return {
		portals: result
	};
};

const redisHandle = async ({ event, resolve }: Parameters<Handle>[0]) => {
	const redis = getClient();
	const cached = await redis.get(`render:${version}:${event.request.url}`);
	if (cached) {
		const parsed = JSON.parse(cached) as {
			body: string;
			headers: Record<string, string>;
		};

		if (parsed.body && parsed.headers) {
			parsed.headers['x-cache'] = 'hit';
			return { cached: parsed };
		}
	}

	const portal = await portalHandle({ event, resolve });
	return portal;
};

const handleCache = async ({ event, resolve }: Parameters<Handle>[0]) => {
	logger.cache(`handle: ${event.request.url}`, 'time');

	const result = await Promise.race([
		redisHandle({
			event,
			resolve
		})
		// this doesn't work cause race is weird
		// and always returns the slowest promise
		// https://github.com/nodejs/node/issues/37683#issuecomment-795896483
		// portalHandle({
		// 	event,
		// 	resolve
		// })
	]);

	if ('portals' in result) {
		if (result.portals.status === 200) {
			const headers = Object.fromEntries(
				result.portals.headers.entries()
			);
			const body = await result.portals.text();

			const redis = getClient();

			redis.set(
				`render:${version}:${event.request.url}`,
				JSON.stringify({
					headers,
					body
				}),
				'EX',
				'60'
			);

			headers['x-cache'] = 'miss';
			logger.cache(`handle: ${event.request.url}`, 'timeEnd');
			logger.cache(`MISS/SET: ${event.request.url}`);
			return new Response(body, {
				headers: new Headers(headers)
			});
		}

		result.portals.headers.set('x-cache', 'miss');

		logger.cache(`handle: ${event.request.url}`, 'timeEnd');
		logger.cache(`MISS: ${event.request.url}`);

		return result.portals;
	}

	logger.cache(`handle: ${event.request.url}`, 'timeEnd');
	logger.cache(`HIT: ${event.request.url}`);
	return new Response(result.cached.body, {
		headers: new Headers(result.cached.headers)
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	if (
		env.REDIS === 'false' ||
		building ||
		event.request.method !== 'GET' ||
		(event.url.pathname.includes('/_api/') &&
			!event.url.pathname.includes('/_api/_cachable/'))
	) {
		logger.cache(`not eligible: ${event.request.url}`);
		return resolve(event);
	}

	logger.cache(`start ----- ${event.request.url}`);
	const result = await handleCache({ event, resolve });
	logger.cache(`end ----- ${event.request.url}`);
	return result;
};
