<script context="module" lang="ts">
	console.info('experimental/template Page: script module call');

	import { browser } from '$app/env';

	export const router = browser;
	export const prerender = true;

	export const thumbnail = 'template.png';
</script>

<script lang="ts">
	console.info('experimental/template Page: script call');
</script>
