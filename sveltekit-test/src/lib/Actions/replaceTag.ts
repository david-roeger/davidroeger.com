import type { ActionReturnType } from '$lib/types';
/**
 * Usage: <div use:replaceTag={string}>
 * Only works with class and children attributes
 *
 * @param { HTMLElement } node Comes from Svelte
 * @param { string } tag new Element tag
 */

/**
 * TODO
 * Seems broken
 * Sometimes Element doesnt get replaced :(
 */

export const replaceTag = (node: HTMLElement, tag = ''): ActionReturnType => {
	const update = (node: HTMLElement) => {
		console.log(node, 1);

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
						newNode.innerHTML = node.innerHTML;

						node.replaceWith(newNode);
						console.log(node, 2);
					} catch (error) {
						throw new Error(
							`${node} not compatible with HTML ${tag}`,
						);
					}
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
