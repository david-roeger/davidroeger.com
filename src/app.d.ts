/// <reference types="@sveltejs/kit" />

declare namespace App {}

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
