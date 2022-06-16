/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {}

	interface Platform {}

	interface Session {
		dreams: import('$lib/types').Dream[];
	}

	interface Stuff {}
}

declare module '*.svg' {
	import { SvelteComponent } from 'svelte';
	const content: SvelteComponent;
	export default content;
}

declare module '*.svg?component' {
	import { SvelteComponent } from 'svelte';
	const content: SvelteComponent;
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
