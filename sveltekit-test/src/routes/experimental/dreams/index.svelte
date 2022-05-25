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
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import { getRandomEmoji } from '$lib/Utils';

	console.info('experimental/dreams Page: script call');

	$: dreams = ($session.dreams ?? []).sort((a, b) => {
		return (
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);
	});

	const formatDate = (date: string) => {
		const parsed = new Date(date);
		return parsed.toLocaleDateString();
	};
</script>

<Headline containerClass="py-8 md:py-16">My Dreams</Headline>

<ul class="grid grid-cols-1 p-1 md:grid-cols-2 lg:grid-cols-3">
	{#each dreams as dream (dream.id)}
		<li class="flex flex-col m-1 -0 bg-white/[.85] border border-mauve-6">
			<div>
				<span>{dream.emoji}</span>
			</div>
			<Headline type="quaternary" class="">
				{formatDate(dream.created_at)}
				<span class="text-mauve-11">
					({formatDate(dream.updated_at)})
				</span>
			</Headline>
			<div class="p-2">
				<p class="whitespace-pre-line">{dream.text}</p>
			</div>
		</li>
	{:else}
		<li>No dreams</li>
	{/each}
</ul>
