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
	import { profile, user } from '$lib/Utils/Auth/store';
	import { goto } from '$app/navigation';
	import type { Dream } from '$lib/types';
	import { getRandomEmoji } from '$lib/Utils';
	import { supabase } from '$lib/Utils/Auth/supabaseClient';
	import Button from '$lib/Components/Button/Button.svelte';
	import Dialog from '$lib/Components/Dialog/Dialog.svelte';
	import NavLink from '$lib/Components/NavLink/NavLink.svelte';
	import { Form } from '$lib/Primitives/Dialog';
	import * as VisuallyHidden from '$lib/Primitives/VisuallyHidden';
	import Head from '$lib/Components/Head/Head.svelte';

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

	let loading = false;

	const handleSignOut = async () => {
		try {
			loading = true;
			if ($user) {
				let { error } = await supabase.auth.signOut();
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
		console.log('handleLoginSubmit form');
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
			} = await supabase.auth.signIn(
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
		console.log('handleDreamSubmit form');
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
		<li class="w-auto p-2 list-none {$user ? 'mr-0' : 'mr-auto '}">
			<Dialog
				disabled={loading || !$user}
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
						disabled={loading || !$user}
					>
						Submit
					</Button>
				</Form>
			</Dialog>
		</li>
		{#if $user}
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
				{#if $user}
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

								<button disabled={loading}>Login</button>
							</Form>
						</Dialog>
					</li>
				{/if}
			</ul>
		</li>
		<li />
	</ul>
</div>

{#if $profile}
	<div class="p-2 border-b xl:max-w-7xl border-mauve-6">
		User: {$profile?.username}
	</div>
{/if}

<Headline containerClass="py-8 md:py-16">Meine Träume</Headline>

<ul
	class="grid grid-cols-1 p-1 mb-32 border-b md:grid-cols-2 lg:grid-cols-3 border-mauve-6"
>
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
			<div class="p-2 bg-white/[.85] grow">
				<p class="whitespace-pre-line">{dream.text}</p>
			</div>
		</li>
	{:else}
		<li>No dreams</li>
	{/each}
</ul>
