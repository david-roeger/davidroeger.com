/// <reference types="@sveltejs/kit" />
declare global {
	declare namespace App {
		interface PageData {
			contactForm: import('$lib/Slices/ContactForm/constants').ContactForm;
		}
	}

	declare module '*.svg' {
		const content: string;
		export default content;
	}
	declare module '*.svg?component' {
		import type { ComponentType, SvelteComponentTyped } from 'svelte';
		import type { SVGAttributes } from 'svelte/elements';

		const content: ComponentType<
			SvelteComponentTyped<SVGAttributes<SVGSVGElement>>
		>;

		export default content;
	}

	declare module '*.svg?src' {
		const content: string;
		export default content;
	}

	declare module '*.svg?url' {
		const content: string;
		export default content;
	}

	declare module '*.png' {
		const content: string;
		export default content;
	}

	// Make Typescript happy
	// https://github.com/JonasKruckenberg/imagetools/issues/160
	declare module '*&imageTools' {
		export default import('$lib/Primitives/Image/imageTools').Picture;
	}

	declare namespace svelteHTML {
		// enhance elements
		// interface IntrinsicElements {}
		// enhance attributes
		interface HTMLAttributes {
			'on:preload'?: (event: {
				detail: { type: 'tap' | 'move' };
			}) => void;
		}
	}
}

export {};
