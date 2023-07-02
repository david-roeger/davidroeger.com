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

export const handle: Handle = async ({ event, resolve }) => {
	const result = await portalHandle({ event, resolve });
	return result.portals;
};
