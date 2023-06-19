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

const portalHandle = async (
	{ event, resolve }: Parameters<Handle>[0],
	{ now, source }: { now: number; source: 'redis' | 'handle' }
) => {
	logger.cache(`portals: ${event.request.url} @ ${source}; ${now}}`, 'time');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return collectPortals(html);
		}
	});

	logger.cache(
		`portals: ${event.request.url} @ ${source}; ${now}}`,
		'timeEnd'
	);
	return {
		portals: result
	};
};

const redisHandle = async (
	{ event, resolve }: Parameters<Handle>[0],
	{ now }: { now: number }
) => {
	const redis = getClient();
	logger.cache(`redis: ${event.request.url}; ${now}`, 'time');
	const cached = await redis.get(`render:${event.request.url}:${version}`);
	if (cached) {
		const parsed = JSON.parse(cached) as {
			body: string;
			headers: Record<string, string>;
		};

		if (parsed.body && parsed.headers) {
			parsed.headers['x-cache'] = 'hit';
			logger.cache(`redis: ${event.request.url}; ${now}`, 'timeEnd');
			return { cached: parsed };
		}
	}

	const portal = await portalHandle(
		{ event, resolve },
		{ source: 'redis', now }
	);
	logger.cache(`redis: ${event.request.url}; ${now}`, 'timeEnd');
	return portal;
};

const handleCache = async ({ event, resolve }: Parameters<Handle>[0]) => {
	const now = new Date().getTime();
	logger.cache(`handle: ${event.request.url}; ${now}`, 'time');
	const result = await Promise.race([
		redisHandle(
			{
				event,
				resolve
			},
			{
				now
			}
		),
		portalHandle(
			{
				event,
				resolve
			},
			{ now, source: 'handle' }
		)
	]);

	if ('portals' in result) {
		if (result.portals.status === 200) {
			const headers = Object.fromEntries(
				result.portals.headers.entries()
			);
			const body = await result.portals.text();

			const redis = getClient();

			redis.set(
				`render:${event.request.url}:${version}`,
				JSON.stringify({
					headers,
					body
				}),
				'EX',
				'30'
			);

			headers['x-cache'] = 'miss';
			logger.cache(`handle: ${event.request.url}; ${now}`, 'timeEnd');
			logger.cache(`CACHE SET: ${event.request.url}`);
			return new Response(body, {
				headers: new Headers(headers)
			});
		}

		result.portals.headers.set('x-cache', 'miss');

		logger.cache(`handle: ${event.request.url}; ${now}`, 'timeEnd');
		logger.cache(`CACHE MISS: ${event.request.url}`);

		return result.portals;
	}

	logger.cache(`handle: ${event.request.url}; ${now}`, 'timeEnd');
	logger.cache(`CACHE HIT: ${event.request.url}`);
	return new Response(result.cached.body, {
		headers: new Headers(result.cached.headers)
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	if (
		env.REDIS === 'false' ||
		building ||
		event.request.method !== 'GET' ||
		event.url.pathname.includes('/_api/')
	) {
		logger.cache(`CACHE NOT ELIGIBLE: ${event.request.url}`);
		return resolve(event);
	}

	logger.cache(`CACHE START: --- ${event.request.url}`);
	const result = await handleCache({ event, resolve });
	logger.cache(`CACHE END: --- ${event.request.url}`);
	return result;
};
