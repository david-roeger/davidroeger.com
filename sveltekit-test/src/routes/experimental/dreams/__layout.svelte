<script context="module" lang="ts">
	console.info('experimental/dreams Layout: script module call');

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params, fetch, session, stuff }) => {
		console.info('experimental/dreams Layout: load call');
		return { props: {} };
	};
</script>

<script lang="ts">
	import Button from '$lib/Components/Button/Button.svelte';
	import Dialog from '$lib/Components/Dialog/Dialog.svelte';
	import { Form } from '$lib/Primitives/Dialog';
	import * as VisuallyHidden from '$lib/Primitives/VisuallyHidden';

	import { user, profile } from '$lib/Utils/Auth/store';
	import { supabase } from '$lib/Utils/Auth/supabaseClient';
	import { writable } from 'svelte/store';

	let loading = false;

	const handleLoginDialog = (
		e: CustomEvent<{
			open: boolean;
		}>,
	) => {};

	const handleSignIn = async ({ email = '', password = '' }) => {};

	const handleSignOut = async () => {
		try {
			loading = true;
			if ($user) {
				let { error } = await supabase.auth.signOut();
				if (error) throw error;
			}
		} catch (error) {
			console.log(error.error_description || error.message);
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
				{ email, password: password ?? undefined },
				{
					shouldCreateUser: false,
				},
			);

			if (error) throw error;
			if (!sessionData) throw new Error('Session is not defined');
			if (!userData) throw new Error('User is not defined');

			loading = false;
			return true;
		} catch (error) {
			loading = false;
			alert(error.error_description || error.message);
			return false;
		}
	};
</script>

<div class="border-b xl:max-w-7xl border-mauve-6">
	<p>Loading: {loading ? 'true' : 'false'}</p>
	<h3><VisuallyHidden.Root>Sub Menu</VisuallyHidden.Root></h3>

	<ul class="flex justify-end">
		<li class="w-auto p-2 mr-auto list-none">
			<Button class={`block bg-white hover:bg-blue-5`}>
				🧿 Neuer Traum
			</Button>
		</li>
		<li>
			<ul class="flex flex-wrap justify-end p-1">
				<li class="p-1 list-none">
					<Button variant="rounded" class="block bg-blue-5">
						Login
					</Button>
				</li>
				<li class="p-1 list-none">
					<Button
						variant="rounded"
						class="block bg-blue-5"
						on:click={handleSignOut}
					>
						Logout
					</Button>
				</li>
			</ul>
		</li>
		<li>
			<Dialog
				trigger="Trigger"
				title="Title"
				description="description"
				on:openChange={handleLoginDialog}
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
	</ul>
	<p>id: {$user?.id}</p>
	<p>username: {$profile?.username}</p>
</div>

<p>// submenu login || add dream (modal?) // submenu login</p>

<p>edit dream (in modal)</p>
<p>if logged in: edit and delete</p>
<p>created at, updated at</p>
<p>text</p>

<slot />
