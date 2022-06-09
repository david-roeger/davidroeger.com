<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Dream } from '$lib/types';
	import { getSupabaseProfile } from '$lib/Utils/Supabase/request';

	export const load: Load = async ({ fetch, session }) => {
		const { dreams, error, status } = await getDreams({ session });

		if (error) {
			return {
				status,
				body: { error: new Error(error.message) },
			};
		}

		const res: Response = await fetch(
			`/experimental/dreams/emojis.json?limit=${dreams.length}`,
		);

		const user = session.user;
		const profile = user
			? await getSupabaseProfile(user, session)
			: undefined;
		if (res.ok) {
			const emojis = await res.json();
			return {
				props: {
					dreams: dreams as Dream[],
					emojis: emojis as string[],
					user,
					profile,
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
	import { page, session } from '$app/stores';
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import { goto } from '$app/navigation';
	import { getRandomEmoji } from '$lib/Utils';
	import { supabaseClient } from '$lib/Utils/Supabase/supabaseClient';
	import Button from '$lib/Components/Button/Button.svelte';
	import Dialog from '$lib/Components/Dialog/Dialog.svelte';
	import NavLink from '$lib/Components/NavLink/NavLink.svelte';
	import { Form } from '$lib/Primitives/Dialog';
	import * as VisuallyHidden from '$lib/Primitives/VisuallyHidden';
	import Head from '$lib/Components/Head/Head.svelte';
	import { onMount } from 'svelte';
	import { getDreams } from '$lib/Utils/Supabase/request';
	import type { User } from '@supabase/supabase-js';
	import { writable, type Writable } from 'svelte/store';

	const dreamsStore: Writable<Dream[]> = writable([]);

	export let emojis: string[];
	export let dreams: Dream[];
	export let error: string;
	export let user: User;
	export let profile: {
		username: string;
		createdAt: string;
		updatedAt: string;
	};

	console.info('experimental/dreams Page: script call');

	$: sortedDreams = (
		$dreamsStore && $dreamsStore.length !== 0 ? $dreamsStore : dreams ?? []
	).sort((a, b) => {
		return (
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);
	});

	onMount(() => {
		$dreamsStore = dreams;
	});

	const formatDate = (date: string) => {
		const parsed = new Date(date);
		return parsed.toLocaleDateString('en-GB');
	};

	let loading = false;

	const handleSignOut = async () => {
		try {
			loading = true;
			if (user) {
				let { error } = await supabaseClient.auth.signOut();
				if (error) throw error;
			}
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	};

	const handleLoginSubmit = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		},
	) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			loading = true;

			if (!email || email.length === 0) {
				throw new Error('E-Mail is required');
			}
			if (!password || password.length === 0) {
				throw new Error('Password is required');
			}
			const {
				session: sessionData,
				user: userData,
				error,
			} = await supabaseClient.auth.signIn(
				{ email, password },
				{
					shouldCreateUser: false,
				},
			);

			if (error) throw error;
			if (!sessionData) throw new Error('Session is not defined');
			if (!userData) throw new Error('User is not defined');
			return true;
		} catch (error) {
			alert(error.error_description || error.message);
			return false;
		} finally {
			loading = false;
		}
	};

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
			const oldDreams = $dreamsStore ?? [];
			const newDreams = dreams.map((dream: Dream) => ({
				id: dream.id,
				text: dream.text,
				created_at: dream.created_at,
				updated_at: dream.updated_at,
				emoji: dream.emoji,
			}));
			$dreamsStore = [...oldDreams, ...newDreams];
			goto('');
			return true;
		} catch (error) {
			alert(error.error_description || error.message);
			return false;
		} finally {
			loading = false;
		}
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

<div class="border-b xl:max-w-7xl border-mauve-6">
	<h3><VisuallyHidden.Root>Sub Menu</VisuallyHidden.Root></h3>

	<ul class="flex flex-wrap justify-end">
		<li class="w-auto p-2 list-none {user ? 'mr-0' : 'mr-auto '}">
			<Dialog
				disabled={loading || !user}
				trigger="🧿 New Dreams"
				triggerClass="bg-white hover:bg-blue-5"
				title="Title"
				description="description"
			>
				<Form handleSubmit={handleDreamSubmit}>
					<textarea
						name="text"
						class="rounded-none resize-none"
						placeholder="Wovon träumst du nachts..."
						required
					/>

					<Button
						class="block bg-white hover:bg-green-5"
						disabled={loading || !user}
						type="submit"
					>
						Submit
					</Button>
					<p>disabled: {loading || !user}</p>
				</Form>
			</Dialog>
		</li>
		{#if user}
			<li class="w-auto p-2 pl-0 mr-auto list-none">
				<NavLink
					href="/experimental/dreams/add"
					class="block bg-white hover:bg-blue-5"
				>
					Add
				</NavLink>
			</li>
		{/if}
		<li>
			<ul class="flex flex-wrap justify-end p-1">
				{#if user}
					<li class="p-1 list-none">
						<Button
							variant="rounded"
							class="block bg-white hover:bg-blue-5"
							on:click={handleSignOut}
						>
							🔒 Logout
						</Button>
					</li>
				{:else}
					<li class="p-1 list-none">
						<Dialog
							trigger="🔓 Login"
							triggerClass="bg-white hover:bg-blue-5"
							triggerRounded
							title="Title"
							description="description"
						>
							<Form handleSubmit={handleLoginSubmit}>
								<input
									type="email"
									name="email"
									required
									disabled={loading}
									placeholder="E-Mail"
								/>
								<input
									type="password"
									name="password"
									required
									disabled={loading}
									placeholder="Passwort"
								/>

								<Button
									class="block bg-white hover:bg-green-5"
									disabled={loading}
									type="submit"
								>
									Login
								</Button>
							</Form>
						</Dialog>
					</li>
				{/if}
			</ul>
		</li>
		<li />
	</ul>
</div>

{#if error}
	<div class="p-2 border-b xl:max-w-7xl border-mauve-6">
		error: {error}
	</div>
{/if}

{#if profile}
	<div class="p-2 border-b xl:max-w-7xl border-mauve-6">
		Profile: {profile?.username}
	</div>
{/if}

<Headline containerClass="py-8 md:py-16" class="flex" />

<ul
	class="grid grid-cols-1 p-1 mb-32 border-b md:grid-cols-2 lg:grid-cols-3 border-mauve-6"
>
	{#each sortedDreams as dream, index (dream.id)}
		<li
			class="flex flex-col m-1 border border-mauve-6 scroll-m-2 {$page.url
				.hash === `#${dream.id.toString()}`
				? 'ring-1 ring-mauve-6'
				: ''}"
			id={dream.id.toString()}
		>
			{#if user}
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
			<div class="p-2 bg-white/[.85] grow">
				<p class="whitespace-pre-line">{dream.text}</p>
			</div>
		</li>
	{:else}
		<li>No dreams</li>
	{/each}
</ul>
