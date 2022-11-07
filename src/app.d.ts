/// <reference types="@sveltejs/kit" />

declare namespace App {}

declare module '*.svg' {
	const content: string;
	export default content;
}
declare module '*.svg?component' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const content: any;
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
