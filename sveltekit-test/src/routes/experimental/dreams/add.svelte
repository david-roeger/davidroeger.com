<script context="module" lang="ts">
	import { getSupabaseProfile } from '$lib/Utils/Auth/request';
	import type { Load } from '@sveltejs/kit';
	console.info('experimental/dreams/add: module call');

	export const load: Load = async ({ fetch, session }) => {
		console.info('experimental/dreams/add: load call');

		const user = session.user;
		if (!user)
			return {
				status: 302,
				redirect: './',
			};

		const profile = user
			? await getSupabaseProfile(user, session)
			: undefined;

		return {
			props: {
				user,
				profile,
			},
		};
	};

	export const prerender = false;
	export const thumbnail = 'dreams.png';
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Components/Button/Button.svelte';
	import Head from '$lib/Components/Head/Head.svelte';
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import type { Dream } from '$lib/types';
	import { getRandomEmoji } from '$lib/Utils';

	import { supabaseClient } from '$lib/Utils/Auth/supabaseClient';

	import type { User } from '@supabase/supabase-js';

	export let user: User;
	export let profile: {
		username: string;
		createdAt: string;
		updatedAt: string;
	};

	console.info('experimental/dreams/add: script call');

	let loading = false;

	const handleDreamSubmit = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		},
	) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const text = formData.get('text') as string;
		try {
			loading = true;

			if (!text || text.length === 0) {
				throw new Error('Enter a dream is required');
			}

			if (!user || !user.id) {
				throw new Error('Not logged in');
			}
			const { data: dreams, error } = await supabaseClient
				.from('dreams')
				.insert([
					{
						text,
						created_by: user.id,
						emoji: getRandomEmoji(),
					},
				]);

			if (error) throw error;
			if (dreams.length !== 0) {
				goto(`../dreams#${dreams[0].id}`);
			} else {
				goto(`../dreams`);
			}
		} catch (error) {
			alert(error.error_description || error.message);
		} finally {
			loading = false;
		}
	};

	// prettier-ignore
	const testEmojis = [
		'1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟',];

	const density = 5;
	const elementSize = 8 + 42 + 8;

	function factorialize(num) {
		if (num < 0) return -1;
		else if (num == 0) return 1;
		else {
			return num * factorialize(num - 1);
		}
	}

	const getCoordinates = (index: number) => {
		let ring = 0;

		const elementsPerRing = ring * density;
		const radius = ring * elementSize;
		const angle = ((2 * Math.PI) / elementsPerRing) * (index % 0);
		return {
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius,
		};
	};
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: '#EDF6FF',
		},
		{
			name: 'apple-mobile-web-app-capable',
			content: 'yes',
		},
		{
			name: 'apple-mobile-web-app-status-bar-style',
			content: 'default',
		},
	]}
/>

{#if profile}
	<div class="p-2 border-b xl:max-w-7xl border-mauve-6">
		Profile: {profile?.username}
	</div>
{/if}

<Headline containerClass="py-8 md:py-16">Neuer Traum</Headline>

<form
	class=" mb-32 border-b border-mauve-6 p-2 bg-white/[.85]"
	on:submit={handleDreamSubmit}
	disabled={loading || !user}
>
	<div class="max-w-[60ch] max-h-[60ch]">
		<div class="aspect-w-1 aspect-h-1">
			<textarea
				id="text"
				name="text"
				placeholder="Wovon träumst du nachts..."
				class="block w-full h-full p-2 bg-white border rounded-none resize-none aspect-square border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 placeholder-mauve-11"
				disabled={loading || !user}
				required
			/>
		</div>
	</div>

	<!--div class="w-[60ch] h-[60ch] overflow-scroll relative">
		{#each testEmojis as emoji, index}
			{@const { x, y } = getCoordinates(index)}

			<Button
				class="absolute block w-[42px] !p-2 text-center border-b rounded-full border-mauve-6 group -translate-x-1/2 -translate-y-1/2"
				style={`left: ${x}px; top: ${y}px;`}
			>
				{emoji}
			</Button>
		{/each}
	</div-->

	<Button
		type="submit"
		variant="rounded"
		class="block w-full max-w-[60ch] mt-2 bg-white hover:bg-green-5"
		disabled={loading || !user}
	>
		Submit
	</Button>
</form>
