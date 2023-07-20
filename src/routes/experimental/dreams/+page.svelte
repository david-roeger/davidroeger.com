<script lang="ts">
	import { page } from '$app/stores';
	import AccessibleIcon from '$lib/Components/AccessibleIcon/AccessibleIcon.svelte';
	import Dialog from '$lib/Components/Dialog/Dialog.svelte';
	import Head from '$lib/Components/Head/Head.svelte';
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import * as VisuallyHidden from '$lib/Primitives/VisuallyHidden';
	import type { PageData } from './$types';

	console.info('experimental/dreams:  +page.svelte');

	export let data: PageData;
	$: console.log('data', data.user);
	$: dreams = data.dreams as {
		id: number;
		emoji?: string;
		created_at: string;
		updated_at: string;
		text: string;
	}[];

	const formatDate = (date: string) => {
		const parsed = new Date(date);
		return parsed.toLocaleDateString('en-GB');
	};
</script>

<div class="border-b xl:max-w-7xl border-mauve-6">
	<h3><VisuallyHidden.Root>Sub Menu</VisuallyHidden.Root></h3>
	<ul class="flex flex-wrap justify-end">
		<!-- {#if data.profile}
			<li class="w-auto p-2 list-none mr-auto">
				<Dialog
					disabled={$insertDreamFormState === FORM_STATE.SUBMITTING ||
						!data.profile}
					trigger="🧿 New Dream"
					triggerClass="bg-white hover:bg-blue-5"
					title="Title"
					description="description"
					bind:setClose={setInsertDreamDialogClose}
				>
					<form
						method="POST"
						action="/experimental/dreams/actions?/insert"
						class="bg-white/[.85] flex flex-col"
						use:insertDreamFormEnhance
					>
						<div
							class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
						>
							<p class="text-xs h-4">
								{#if $insertDreamForm && 'invalidValues' in $insertDreamForm && $insertDreamForm.invalidValues?.default}
									{$insertDreamForm.invalidValues.default}
								{/if}
							</p>
						</div>

						<input
							type="hidden"
							name="createdBy"
							value={data.session?.user.id}
						/>
						<div
							class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
						>
							<label
								for="text"
								class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1"
							>
								Wovon träumst du nachts?
							</label>
							<textarea
								name="text"
								id="text"
								class="py-2 px-4 border-mauve-12 rounded-none resize-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent"
								placeholder="Ganz viele Schafe..."
								value={insertDreamText}
								disabled={$insertDreamFormState ===
									FORM_STATE.SUBMITTING}
							/>

							<p class="text-xs h-4">
								{#if $insertDreamForm && 'invalidValues' in $insertDreamForm && $insertDreamForm.invalidValues?.text}
									{$insertDreamForm.invalidValues.text}
								{/if}
							</p>
						</div>
						<div
							class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
						>
							<EmojiPicker
								name="emoji"
								defaultValue={insertDreamEmoji || undefined}
								disabled={$insertDreamFormState ===
									FORM_STATE.SUBMITTING}
							/>
							<p class="text-xs h-4">
								{#if $insertDreamForm && 'invalidValues' in $insertDreamForm && $insertDreamForm.invalidValues?.emoji}
									{$insertDreamForm.invalidValues.emoji}
								{/if}
							</p>
						</div>

						<Button
							class="block bg-white hover:bg-green-5"
							disabled={$insertDreamFormState ===
								FORM_STATE.SUBMITTING || !data.profile}
							type="submit"
						>
							Submit
						</Button>
					</form>
				</Dialog>
			</li>
		{/if} -->
		<li>
			<!-- <ul class="flex flex-wrap justify-end p-1">
				{#if data.profile}
					<li class="p-1 list-none">
						<form
							method="POST"
							action="/experimental/dreams/logout"
							class="bg-white/[.85] flex flex-col"
							use:logoutFormEnhance
						>
							<Button
								type="submit"
								variant="rounded"
								class="block bg-white hover:bg-blue-5"
							>
								🔒 Logout
							</Button>
						</form>
					</li>
				{:else}
					<li class="p-1 list-none">
						<Dialog
							trigger="🔓 Login"
							triggerClass="bg-white hover:bg-blue-5"
							triggerRounded
							title="Login"
							titleClass="text-xl p-2"
							description="description"
						>
							<form
								method="POST"
								action="/experimental/dreams/login"
								class="bg-white/[.85] flex flex-col"
								use:loginFormEnhance
							>
								<div
									class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
								>
									<p class="text-xs h-4">
										{#if $loginForm && 'invalidValues' in $loginForm && $loginForm.invalidValues?.default}
											{$loginForm.invalidValues.default}
										{/if}
									</p>
								</div>

								<div
									class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
								>
									<label
										for="email"
										class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1"
									>
										E-Mail*
									</label>
									<input
										id="email"
										class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent"
										name="email"
										autocomplete="email"
										enterkeyhint="send"
										placeholder="email@example.com"
										type="email"
										value={loginFormEmail}
										disabled={$loginFormState ===
											FORM_STATE.SUBMITTING}
									/>

									<p class="text-xs h-4">
										{#if $loginForm && 'invalidValues' in $loginForm && $loginForm.invalidValues?.email}
											{$loginForm.invalidValues.email}
										{/if}
									</p>
								</div>

								<div
									class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
								>
									<label
										for="password"
										class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1"
									>
										Password*
									</label>
									<input
										id="password"
										class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent"
										name="password"
										autocomplete="password"
										enterkeyhint="send"
										placeholder="********"
										type="password"
										disabled={$loginFormState ===
											FORM_STATE.SUBMITTING}
										value={loginFormPassword}
									/>

									<p class="text-xs h-4">
										{#if $loginForm && 'invalidValues' in $loginForm && $loginForm.invalidValues?.password}
											{$loginForm.invalidValues.password}
										{/if}
									</p>
								</div>

								<button
									disabled={$loginFormState ===
										FORM_STATE.SUBMITTING}
								>
									Login
								</button>
							</form>
						</Dialog>
					</li>
				{/if}
			</ul> -->
		</li>
	</ul>
</div>

<Headline containerClass="py-8 md:py-16" class="flex">
	<span>Meine Träume 3</span>
</Headline>

<ul
	class="mb-32 grid grid-cols-1 p-1 border-b md:grid-cols-2 lg:grid-cols-3 border-mauve-6 grid-rows-[masonry]"
>
	{#each dreams as dream (dream.id)}
		{@const active = $page.url.hash === `#${dream.id.toString()}`}
		<li
			class="flex flex-col m-1 border border-mauve-6 scroll-m-2 {active
				? 'ring-1 ring-mauve-6'
				: ''}"
			id={dream.id.toString()}
		>
			<div class="flex bg-white">
				<span
					class="w-10 p-2 text-center border-b border-mauve-6 group"
				>
					<span
						class="block transition-transform group-hover:animate-cool-wiggle"
					>
						{dream.emoji
							? dream.emoji
							: data?.emojiMap?.[dream.id] ?? ''}
					</span>
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
				<!-- {#if data.profile}
					<Dialog
						disabled={$editDreamFormState ===
							FORM_STATE.SUBMITTING || !data.profile}
						triggerClass="w-10 !px-2 text-center transition-colors border-t-0 border-r-0 !border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1 ring-inset {$editDreamFormState !==
							FORM_STATE.SUBMITTING && data.profile
							? 'group'
							: ''}"
						title="Title"
						description="description"
						bind:setClose={setEditDreamDialogClose}
					>
						<AccessibleIcon label="edit" slot="trigger">
							<EditIcon
								class="block w-auto h-full group-hover:animate-spin icon-mauve-11"
							/>
						</AccessibleIcon>
						<form
							method="POST"
							action="/experimental/dreams/actions?/edit"
							class="bg-white/[.85] flex flex-col"
							use:editDreamFormEnhance
						>
							<div
								class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
							>
								<p class="text-xs h-4">
									{#if $editDreamForm && 'invalidValues' in $editDreamForm && $editDreamForm.invalidValues?.default && editDreamId === dream.id}
										{$editDreamForm.invalidValues.default}
									{/if}
								</p>
							</div>

							<input
								type="hidden"
								name="dreamId"
								value={dream.id}
							/>
							<div
								class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
							>
								<label
									for="text"
									class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1"
								>
									Wovon träumst du nachts?
								</label>
								<textarea
									name="text"
									id="text"
									class="py-2 px-4 border-mauve-12 rounded-none resize-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent"
									placeholder="Ganz viele Schafe..."
									value={editDreamId === dream.id
										? editDreamText
										: dream.text}
									disabled={$editDreamFormState ===
										FORM_STATE.SUBMITTING}
								/>

								<p class="text-xs h-4">
									{#if $editDreamForm && 'invalidValues' in $editDreamForm && $editDreamForm.invalidValues?.text && editDreamId === dream.id}
										{$editDreamForm.invalidValues.text}
									{/if}
								</p>
							</div>
							<div
								class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
							>
								<EmojiPicker
									name="emoji"
									defaultValue={editDreamId === dream.id
										? editDreamEmoji
										: dream.emoji
										? dream.emoji
										: data?.emojiMap?.[dream.id]}
									disabled={$editDreamFormState ===
										FORM_STATE.SUBMITTING}
								/>
								<p class="text-xs h-4">
									{#if $editDreamForm && 'invalidValues' in $editDreamForm && $editDreamForm.invalidValues?.emoji && editDreamId === dream.id}
										{$editDreamForm.invalidValues.emoji}
									{/if}
								</p>
							</div>

							<Button
								class="block bg-white hover:bg-green-5"
								disabled={$editDreamFormState ===
									FORM_STATE.SUBMITTING || !data.profile}
								type="submit"
							>
								Update
							</Button>
						</form>
					</Dialog>
				{/if} -->

				<!-- remove dialog-->
				<!-- {#if data.profile}
					<Dialog
						disabled={$removeDreamFormState ===
							FORM_STATE.SUBMITTING || !data.profile}
						triggerClass="w-10 !px-2 text-center transition-colors border-t-0 border-r-0 !border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1 ring-inset {$removeDreamFormState !==
							FORM_STATE.SUBMITTING && data.profile
							? 'group'
							: ''}"
						title="Title"
						description="description"
						bind:setClose={setRemoveDreamDialogClose}
					>
						<AccessibleIcon label="delete" slot="trigger">
							<CloseIcon />
						</AccessibleIcon>
						<form
							method="POST"
							action="/experimental/dreams/actions?/remove"
							class="bg-white/[.85] flex flex-col"
							use:removeDreamFormEnhance
						>
							<div
								class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
							>
								<p class="text-xs h-4">
									{#if $removeDreamForm && 'invalidValues' in $removeDreamForm && $removeDreamForm.invalidValues?.default && removeDreamId === dream.id}
										{$removeDreamForm.invalidValues.default}
									{/if}
								</p>
							</div>

							<input
								type="hidden"
								name="dreamId"
								value={dream.id}
							/>
							<div
								class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
							>
								<Close
									class="block px-4 py-2 transition-colors bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 hover:bg-green-5"
								>
									Abbrechen
								</Close>
								<Button
									class="block bg-red-5"
									type="submit"
									disabled={$removeDreamFormState ===
										FORM_STATE.SUBMITTING || !data.profile}
								>
									Löschen
								</Button>
							</div>
						</form>
					</Dialog>
				{/if} -->
			</div>
			<div class="p-2 bg-white/[.85] grow">
				<p class="whitespace-pre-line">{dream.text}</p>
			</div>
		</li>
	{:else}
		<li>No dreams yet recorded 😴</li>
	{/each}
</ul>
