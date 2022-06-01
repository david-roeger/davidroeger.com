<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import Button from '$lib/Components/Button/Button.svelte';
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import type { Dream } from '$lib/types';
	import { emojis, getRandomEmoji } from '$lib/Utils';

	import { user } from '$lib/Utils/Auth/store';
	import { supabase } from '$lib/Utils/Auth/supabaseClient';

	import { onMount } from 'svelte';

	let loading = true;
	onMount(() => {
		if (!$user) goto('./', { replaceState: true });
		loading = false;
	});

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

			if (!$user || !$user.id) {
				throw new Error('Not logged in');
			}
			const { data: dreams, error } = await supabase
				.from('dreams')
				.insert([
					{ text, created_by: $user.id, emoji: getRandomEmoji() },
				]);

			if (error) throw error;
			const oldDreams = $session.dreams ?? [];
			const newDreams = dreams.map((dream: Dream) => ({
				id: dream.id,
				text: dream.text,
				created_at: dream.created_at,
				updated_at: dream.updated_at,
				emoji: dream.emoji,
			}));
			$session.dreams = [...oldDreams, ...newDreams];
			if (newDreams.length !== 0) {
				goto(`../dreams#${newDreams[0].id}`);
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

<Headline containerClass="py-8 md:py-16">Neuer Traum</Headline>

<form
	class="p-2 mb-32 border-b border-mauve-6 bg-white/[0.85]"
	on:submit={handleDreamSubmit}
	disabled={loading || !$user}
>
	<textarea
		name="text"
		class="block w-full max-w-[60ch] h-[20ch] p-2 bg-white border resize-none border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
		disabled={loading || !$user}
		placeholder="Wovon träumst du nachts..."
		required
	/>
	<div class="w-[60ch] h-[60ch] overflow-scroll relative">
		{#each testEmojis as emoji, index}
			{@const { x, y } = getCoordinates(index)}

			<Button
				class="absolute block w-[42px] !p-2 text-center border-b rounded-full border-mauve-6 group -translate-x-1/2 -translate-y-1/2"
				style={`left: ${x}px; top: ${y}px;`}
			>
				{emoji}
			</Button>
		{/each}
	</div>

	<Button
		type="submit"
		variant="rounded"
		class="block w-full max-w-[60ch] mt-2 bg-white hover:bg-green-5"
		disabled={loading || !$user}
	>
		Submit
	</Button>
</form>
