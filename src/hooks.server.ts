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

export const handle: Handle = ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) => {
			return collectPortals(html);
		}
	});
};
