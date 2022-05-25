<script context="module" lang="ts">
	console.info('experimental/dreams Layout: script module call');
</script>

<script lang="ts">
	import { session } from '$app/stores';

	import Button from '$lib/Components/Button/Button.svelte';
	import Dialog from '$lib/Components/Dialog/Dialog.svelte';
	import { Form } from '$lib/Primitives/Dialog';
	import * as VisuallyHidden from '$lib/Primitives/VisuallyHidden';
	import type { Dream } from '$lib/types';
	import { getRandomEmoji } from '$lib/Utils';

	import { user, profile } from '$lib/Utils/Auth/store';
	import { supabase } from '$lib/Utils/Auth/supabaseClient';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

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
			loading = false;
			return true;
		} catch (error) {
			loading = false;
			alert(error.error_description || error.message);
			return false;
		}
	};

	onMount(() => {
		console.log('onMount');
		console.log($user);
		console.log('-----');
	});
</script>

<div class="border-b xl:max-w-7xl border-mauve-6">
	<h3><VisuallyHidden.Root>Sub Menu</VisuallyHidden.Root></h3>

	<ul class="flex flex-wrap justify-end">
		<li class="w-auto p-2 mr-auto list-none">
			<Dialog
				disabled={loading || !$user}
				trigger="🧿 Neuer Traum"
				triggerClass="bg-white hover:bg-blue-5"
				title="Title"
				description="description"
			>
				<Form handleSubmit={handleDreamSubmit}>
					<textarea name="text" class="resize-none ">
						At w3schools.com you will learn how to make a website.
						They offer free tutorials in all web development
						technologies.
					</textarea>

					<button disabled={loading || !$user}>Absenden</button>
				</Form>
			</Dialog>
		</li>
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

<p>Loading: {loading ? 'true' : 'false'}</p>
<p>id: {$user?.id}</p>
<p>username: {$profile?.username}</p>
<br />
<br />
<br />
<slot />
