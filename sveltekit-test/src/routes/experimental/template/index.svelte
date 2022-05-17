<script context="module" lang="ts">
	console.info('experimental/template Page: script module call');

	import { browser, dev } from '$app/env';

	export const hydrate = dev;
	export const router = browser;
	export const prerender = true;

	export const thumbnail = 'template.png';
</script>

<script lang="ts">
	console.info('experimental/template Page: script call');
</script>
