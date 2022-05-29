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
			`dreams/emojis.json?limit=${dreams.length}`,
		);

		if (res.ok) {
			const emojis = await res.json();
			console.log(emojis);
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
	import { session } from '$app/stores';
	import Headline from '$lib/Components/Headline/Headline.svelte';

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

	console.log(emojis);
</script>

<Headline containerClass="py-8 md:py-16">My Dreams</Headline>

<ul class="grid grid-cols-1 p-1 md:grid-cols-2 lg:grid-cols-3">
	{#each dreams as dream, index (dream.id)}
		<div>
			<li
				class="flex flex-col m-1 border -0 border-mauve-6 bg-white/[.85]"
			>
				<div class="flex">
					<span class="w-10 p-2 text-center border-b border-mauve-6">
						{!!dream.emoji ? dream.emoji : emojis[index]}
					</span>
					<Headline type="quaternary" containerClass="grow border-l">
						{formatDate(dream.created_at)}
						<span class="text-mauve-11">
							({formatDate(dream.updated_at)})
						</span>
					</Headline>
				</div>
				<div class="p-2">
					<p class="whitespace-pre-line">{dream.text}</p>
				</div>
			</li>
		</div>
	{:else}
		<li>No dreams</li>
	{/each}
</ul>
