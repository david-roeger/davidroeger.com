/// <reference types="@sveltejs/kit" />
/// <reference types="lucia" />

declare global {
	// eslint-disable-next-line no-var
	declare const __BUILD_TIME__: string;
	// eslint-disable-next-line no-var
	declare const __BUILD_HASH__: string;
	namespace Lucia {
		type Auth = import('$utils/Lucia/lucia').Auth;
		type DatabaseUserAttributes = {
			name: string;
			role: 'admin' | 'user';
		};
		type DatabaseSessionAttributes = {};
	}
	declare namespace App {
		interface PageData {
			user: import('lucia').User | undefined;
			contactForm: import('$slices/ContactForm/constants').ContactForm;
			addDreamForm: import('$slices/AddDreamForm/constants').AddDreamForm;
			editDreamForm: import('$slices/EditDreamForm/constants').EditDreamForm;
		}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// src/app.d.ts
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
		export default import('$primitives/Image/imageTools').Picture;
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
