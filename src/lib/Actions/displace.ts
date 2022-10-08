import type { ActionReturnType } from '$lib/types';
/**
 * Usage: <div use:portal> or <div use:portal={Element | CSS Selector}>
 *
 * @param { HTMLElement } node Comes from Svelte
 */

export const displace = (node: HTMLElement): ActionReturnType => {
	function update() {
		const text = node.textContent;
		const chars: HTMLSpanElement[] = [];

		node.style.position = 'relative';

		if (text) {
			const textArray = [...text];
			textArray.forEach((char) => {
				const span = document.createElement('span');
				span.classList.add('char-wrapper');
				span.dataset.char = char;

				const innerSpan = document.createElement('span');
				innerSpan.classList.add('char');
				innerSpan.textContent = char;

				span.appendChild(innerSpan);
				chars.push(span);
			});

			node.replaceChildren(...chars);
			node.classList.add('displace');
			node.classList.add('word');
		}
	}
	update();

	return {
		update
	};
};
