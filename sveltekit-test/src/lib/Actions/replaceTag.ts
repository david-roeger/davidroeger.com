import type { ActionReturnType } from '$lib/types';
/**
 * Usage: <div use:replaceTag={string}>
 * Only works with class and children attributes
 *
 * @param { HTMLElement } node Comes from Svelte
 * @param { string } tag new Element tag
 */

export const replaceTag = (node: HTMLElement, tag = ''): ActionReturnType => {
    const update = (node: HTMLElement) => {
        if (tag && tag.toLowerCase() !== 'div') {
            try {
                const newNode = document.createElement(tag.toLowerCase());
                node.classList.forEach((c) => {
                    newNode.classList.add(c);
                });
                const children = node.querySelector(':scope > *');
                newNode.replaceChildren(children);
                node.replaceWith(newNode);
            } catch (error) {
                throw new Error(`${tag} is not a valid HTML tag`);
            }
            return;
        }
    };
    update(node);

    return {
        update,
    };
};
