<script context="module" lang="ts">
	console.info('experimental/dreams Page: script module call');

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session, fetch }) => {
		const { dreams, error, status } = await getDreams();
		if (error) {
			return {
				status,
				error: new Error(error.message),
			};
		}

		session.dreams = dreams;
		const res: Response = await fetch(
			`/experimental/dreams/emojis.json?limit=${dreams.length}`,
		);

		if (res.ok) {
			const emojis = await res.json();
			return {
				props: {
					emojis: emojis as string[],
				},
			};
		}

		return {
			status: 404,
			error: new Error('No Emojis found'),
		};
	};

	export const prerender = false;

	export const thumbnail = 'dreams.png';
</script>

<script lang="ts">
	import { getDreams } from '$lib/Utils/Auth/request';
	import { page, session } from '$app/stores';
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import { user } from '$lib/Utils/Auth/store';

	export let emojis: string[];
	console.info('experimental/dreams Page: script call');

	$: dreams = ($session.dreams ?? []).sort((a, b) => {
		return (
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);
	});

	const formatDate = (date: string) => {
		const parsed = new Date(date);
		return parsed.toLocaleDateString('en-GB');
	};
</script>

<Headline containerClass="py-8 md:py-16">Meine Träume</Headline>

<ul class="grid grid-cols-1 p-1 md:grid-cols-2 lg:grid-cols-3">
	{#each dreams as dream, index (dream.id)}
		<li
			class="flex flex-col m-1 border border-mauve-6 scroll-m-2 {$page.url
				.hash === `#${dream.id.toString()}`
				? 'ring-1 ring-mauve-6'
				: ''}"
			id={dream.id.toString()}
		>
			{#if $user}
				<p class="bg-white border-b border-mauve-6">edit</p>
			{/if}
			<div class="flex bg-white">
				<span
					class="w-10 p-2 text-center border-b border-mauve-6 group"
				>
					<span class="block group-hover:animate-cool-wiggle">
						{!!dream.emoji ? dream.emoji : emojis[index]}
					</span>
				</span>
				<Headline
					as="h2"
					type="quaternary"
					containerClass="grow border-l"
				>
					{formatDate(dream.created_at)}
					<span class="text-mauve-11">
						({formatDate(dream.updated_at)})
					</span>
				</Headline>
			</div>
			<div class="p-2 bg-white/[.85]">
				<p class="whitespace-pre-line">{dream.text}</p>
			</div>
		</li>
	{:else}
		<li>No dreams</li>
	{/each}
</ul>
