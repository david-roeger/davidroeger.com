<script context="module" lang="ts">
	console.info('experimental/dreams Page: script module call');

	import { browser } from '$app/env';

	export const router = browser;
	export const prerender = false;

	export const thumbnail = 'dreams.png';
</script>

<script lang="ts">
	console.info('experimental/dreams Page: script call');
</script>

<h1>all my dreams</h1>
