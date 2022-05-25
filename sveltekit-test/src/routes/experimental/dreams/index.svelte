<script context="module" lang="ts">
	console.info('experimental/dreams Page: script module call');

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		const { dreams, error, status } = await getDreams();
		if (error) {
			return {
				status,
				error,
			};
		}
		session.dreams = dreams;

		return {
			props: {},
		};
	};

	export const prerender = false;

	export const thumbnail = 'dreams.png';
</script>

<script lang="ts">
	import { getDreams } from '$lib/Utils/Auth/request';
	import { user } from '$lib/Utils/Auth/store';
	import { session } from '$app/stores';

	console.info('experimental/dreams Page: script call');
	$: console.log($session.dreams);
</script>

<h1>all my dreams</h1>
<p>user: {$user?.id}</p>
{#each $session.dreams as dream}
	<p>Created at: {dream.created_at}</p>
	<p>Updated at: {dream.updated_at}</p>

	<p>{dream.text}</p>
	<p>--------------</p>
{:else}
	<p>no dreams recorded yet</p>
{/each}
