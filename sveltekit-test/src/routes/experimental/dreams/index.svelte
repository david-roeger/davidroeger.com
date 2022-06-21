<script context="module" lang="ts">
	console.info('experimental/dreams Page: module call');
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session, props, fetch }) => {
		console.info('experimental/dreams Page: load call');
		const { dreams, ...restProps } = props;
		session.dreams = dreams;

		const dreamsWithoutEmoji = dreams.filter((dream) => !dream.emoji);

		if (dreamsWithoutEmoji.length === 0) {
			return {
				props: {
					...restProps,
					emojis: [],
				},
			};
		}

		const res: Response = await fetch(
			`/experimental/dreams/emojis.json?limit=${dreamsWithoutEmoji.length}`,
		);

		if (res.ok) {
			const emojis = await res.json();
			const emojiMap = {};
			dreamsWithoutEmoji.forEach((dream, index) => {
				emojiMap[dream.id] = emojis[index];
			});
			return {
				props: {
					...restProps,
					emojiMap: emojiMap as { [key: string]: string },
				},
			};
		}

		return {
			status: 404,
			body: { error: new Error('No Emojis found') },
		};
	};

	export const prerender = false;
	export const thumbnail = 'dreams.png';
</script>

<script lang="ts">
	import type { Dream } from '$lib/types';

	import { goto } from '$app/navigation';

	import { page, session } from '$app/stores';
	import { profile, user } from '$lib/Utils/Auth/store';

	import { getRandomEmoji } from '$lib/Utils';
	import { supabase } from '$lib/Utils/Auth/supabaseClient';

	import Head from '$lib/Components/Head/Head.svelte';
	import Headline from '$lib/Components/Headline/Headline.svelte';

	import Dialog from '$lib/Components/Dialog/Dialog.svelte';
	import { Form, Close } from '$lib/Primitives/Dialog';

	import { Button } from '$lib/Components/Button';
	import NavLink from '$lib/Components/NavLink/NavLink.svelte';

	import * as VisuallyHidden from '$lib/Primitives/VisuallyHidden';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import EditIcon from '$assets/Icons/24/edit.svg?component';
	import CloseIcon from '$assets/Icons/24/close.svg?component';
	import {
		insertDream,
		updateDream,
		deleteDream,
	} from '$lib/Utils/Auth/request';

	export let emojiMap: { [key: string]: string };
	export let error: string;

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

	const handleAddDreamSubmit = async (
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

			const { dream, error } = await insertDream({
				text,
				created_by: $user.id,
				emoji: getRandomEmoji(),
			});

			if (error) throw error;

			if (!dream) {
				throw new Error('Something went wrong. No dream was returned');
			}

			const oldDreams = $session.dreams ?? [];
			const newDream = {
				id: dream.id,
				text: dream.text,
				created_at: dream.created_at,
				updated_at: dream.updated_at,
				emoji: dream.emoji,
			};
			$session.dreams = [...oldDreams, newDream];
			goto(`#${newDream.id}`);

			return true;
		} catch (error) {
			alert(error.error_description || error.message);
			return false;
		} finally {
			loading = false;
		}
	};

	const handleUpdateDreamSubmit = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		},
		oldDream: Dream,
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

			if (!oldDream || !oldDream.id) {
				throw new Error('Something went wrong. No dream found');
			}

			if (text === oldDream.text) {
				goto(`#${oldDream.id}`);
				return true;
			}

			const { dream, error } = await updateDream({
				text,
				id: oldDream.id,
			});

			if (error) throw error;

			if (!dream) {
				throw new Error('Something went wrong. No dream was returned');
			}

			const oldDreams = $session.dreams ?? [];
			const updatedDream = {
				id: dream.id,
				text: dream.text,
				created_at: dream.created_at,
				updated_at: dream.updated_at,
				emoji: dream.emoji,
			};

			const computedDreams = oldDreams.map((oldDream: Dream) => {
				if (oldDream.id === updatedDream.id) return updatedDream;
				return oldDream;
			});

			$session.dreams = [...computedDreams];

			goto(`#${updatedDream.id}`);

			return true;
		} catch (error) {
			alert(error.error_description || error.message);
			return false;
		} finally {
			loading = false;
		}
	};

	const handleDeleteDreamSubmit = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		},
		oldDream: Dream,
	) => {
		e.preventDefault();

		try {
			loading = true;

			if (!$user || !$user.id) {
				throw new Error('Not logged in');
			}

			if (!oldDream || !oldDream.id) {
				throw new Error('Something went wrong. No dream found');
			}

			const { dream: deletedDream, error } = await deleteDream({
				id: oldDream.id,
			});

			if (error) throw error;

			if (!deletedDream) {
				throw new Error('Something went wrong. No dream was returned');
			}

			if (error) throw error;
			const oldDreams = $session.dreams ?? [];
			const computedDreams = oldDreams.filter(
				(oldDream: Dream) => oldDream.id !== deletedDream.id,
			);

			$session.dreams = [...computedDreams];

			goto('', { noscroll: true });

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
	additionalLinkTags={[
		// manifest
		{
			rel: 'manifest',
			href: '/dreams.webmanifest',
		},
	]}
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

<Headline containerClass="py-8 md:py-16" class="flex">
	<span>Meine Träume</span>
</Headline>

<ul
	class="grid grid-cols-1 p-1 mb-8 border-b md:grid-cols-2 lg:grid-cols-3 border-mauve-6 md:mb-16 grid-rows-[masonry]"
>
	{#each dreams as dream (dream.id)}
		<li
			class="flex flex-col m-1 border border-mauve-6 scroll-m-2 {$page.url
				.hash === `#${dream.id.toString()}`
				? 'ring-1 ring-mauve-6'
				: ''}"
			id={dream.id.toString()}
		>
			<div class="flex bg-white">
				<span
					class="w-10 p-2 text-center border-b border-mauve-6 group"
				>
					{#if $user}
						<span class="block">
							{dream.id}
						</span>
					{:else}
						<span
							class="block transition-transform group-hover:animate-cool-wiggle"
						>
							{!!dream.emoji ? dream.emoji : emojiMap[dream.id]}
						</span>
					{/if}
				</span>
				<Headline
					as="h2"
					type="quaternary"
					containerClass="grow border-l flex"
				>
					{formatDate(dream.created_at)}
					<span class="text-mauve-11">
						({formatDate(dream.updated_at)})
					</span>
				</Headline>

				<!-- edit dialog-->
				{#if $user}
					<Dialog
						disabled={loading || !$user}
						triggerClass="w-10 !px-2 text-center transition-colors border-t-0 border-r-0 !border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1 ring-inset {!loading &&
						$user
							? 'group'
							: ''}"
						title="Title"
						description="description"
					>
						<AccessibleIcon label="edit" slot="trigger">
							<EditIcon
								class="block w-auto h-full group-hover:animate-spin"
							/>
						</AccessibleIcon>
						<Form
							handleSubmit={(e) =>
								handleUpdateDreamSubmit(e, dream)}
						>
							<textarea
								name="text"
								class="rounded-none resize-none disab"
								placeholder="Wovon träumst du nachts..."
								value={dream.text}
								required
							/>

							<Button
								class="block bg-white hover:bg-green-5"
								type="submit"
								disabled={loading || !$user}
							>
								Update
							</Button>
						</Form>
					</Dialog>
				{/if}

				<!-- delete dialog-->
				{#if $user}
					<Dialog
						disabled={loading || !$user}
						triggerClass="w-10 !px-2 text-center transition-colors border-t-0 border-r-0 !border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1 ring-inset {!loading &&
						$user
							? 'group'
							: ''}"
						title="Traum löschen ({dream.id})"
						description="Dies kann nicht rückgängig gemacht werden. Bist du sicher?"
					>
						<span
							class="w-auto h-full transition-transform group-hover:animate-spin group-focus:animate-spin"
							slot="trigger"
						>
							<AccessibleIcon label="edit">
								<CloseIcon />
							</AccessibleIcon>
						</span>
						<Form
							handleSubmit={(e) =>
								handleDeleteDreamSubmit(e, dream)}
						>
							<Close
								class="block px-4 py-2 transition-colors bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 hover:bg-green-5"
							>
								Abbrechen
							</Close>
							<Button
								class="block bg-red-5 hover:font-bold"
								type="submit"
								disabled={loading || !$user}
							>
								Löschen
							</Button>
						</Form>
					</Dialog>
				{/if}
			</div>
			<div class="p-2 bg-white/[.85] grow">
				<p class="whitespace-pre-line">{dream.text}</p>
			</div>
		</li>
	{:else}
		<li>No dreams yet recorded 😴</li>
	{/each}
</ul>
