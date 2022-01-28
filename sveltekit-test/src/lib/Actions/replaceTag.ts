import { Tag } from '$lib/Primitives/Tags';
import type { ActionReturnType } from '$lib/types';
import type { attr } from 'svelte/internal';
/**
 * Usage: <div use:replaceTag={string}>
 * Only works with class and children attributes
 *
 * @param { HTMLElement } node Comes from Svelte
 * @param { string } tag new Element tag
 */

export const replaceTag = (node: HTMLElement, tag = ''): ActionReturnType => {
	const update = (node: HTMLElement) => {
		if (tag) {
			const tagName = tag.toLowerCase();

			if (tagName !== node.tagName.toLowerCase()) {
				try {
					const newNode = document.createElement(tag.toLowerCase());

					// copy all html attributes from node to newNode
					try {
						for (const key in node.attributes) {
							node.getAttributeNames().forEach((attr) => {
								newNode.setAttribute(
									attr,
									node.getAttribute(attr),
								);
							});
						}
					} catch (error) {
						console.error(error);
					}

					newNode.innerHTML = node.innerHTML;
					node.replaceWith(newNode);
				} catch (error) {
					throw new Error(`${tag} is not a valid HTML tag`);
				}
				return;
			}
		}
	};
	update(node);

	return {
		update,
	};
};
