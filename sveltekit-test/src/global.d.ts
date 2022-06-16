/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		user: import('@supabase/supabase-js').User;
		accessToken: string | null;
		error: import('@supabase/supabase-js').ApiError;
	}

	interface Platform {}

	interface Session {
		user: import('@supabase/supabase-js').User;
		accessToken?: string;
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
