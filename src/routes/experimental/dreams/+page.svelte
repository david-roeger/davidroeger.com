<script lang="ts">
	import { page } from '$app/stores';
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import AddDreamForm from '$lib/Slices/AddDreamForm/AddDreamForm.svelte';
	import type { PageData } from './$types';

	import * as VisuallyHidden from '$lib/Primitives/VisuallyHidden';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import { DREAMS_KEYS } from './constants';
	import type { Dream } from '$lib/types';
	import { derived, writable } from 'svelte/store';
	import { getLoadingEmojis, replaceStateWithQuery } from '$lib/Utils';
	import type { Pageable } from '$components/Pagination/types';
	import Pagination from '$components/Pagination/Pagination.svelte';

	console.info('experimental/dreams:  +page.svelte');

	export let data: PageData;

	$: user = data.user;

	const queryFn = async ({ size, page }: { size: number; page: number }) =>
		(await fetch(`/_api/dreams?size=${size}&page=${page}`))
			.json()
			.then((data) => data as Pageable<Dream>);

	const o = writable({
		size: data.size,
		page: data.page
	});

	$: $o = {
		size: data.size,
		page: data.page
	};

	const query = createQuery(
		derived(o, ($o) => ({
			queryKey: DREAMS_KEYS.page($o.size, $o.page),
			queryFn: () => queryFn({ size: $o.size, page: data.page }),
			placeholderData: keepPreviousData
		}))
	);

	const formatDate = (date: string) => {
		const parsed = new Date(date);
		return parsed.toLocaleDateString('en-GB');
	};

	const BOUNDARY_COUNT = 1;
	const SIBLING_COUNT = 1;

	const range = (start: number, end: number) => {
		const length = end - start + 1;
		return Array.from({ length }, (_, i) => start + i);
	};

	const getInRange = (
		current: number,
		last: number,
		boundaryCount: number,
		siblingCount: number
	) => {
		const startPages = range(1, Math.min(boundaryCount, last));
		const endPages = range(
			Math.max(last - boundaryCount + 1, boundaryCount + 1),
			last
		);

		const siblingsStart = Math.max(
			Math.min(
				// Natural start
				current - siblingCount,
				// Lower boundary when page is high
				last - boundaryCount - siblingCount * 2 - 1
			),
			// Greater than startPages
			boundaryCount + 2
		);

		const siblingsEnd = Math.min(
			Math.max(
				// Natural end
				current + siblingCount,
				// Upper boundary when page is low
				boundaryCount + siblingCount * 2 + 2
			),
			// Less than endPages
			endPages.length > 0 ? endPages[0] - 2 : last - 1
		);

		// Basic list of items to render
		// e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
		const itemList = [
			...startPages,

			// Start ellipsis
			// eslint-disable-next-line no-nested-ternary
			...(siblingsStart > boundaryCount + 2
				? [-1]
				: boundaryCount + 1 < last - boundaryCount
				? [boundaryCount + 1]
				: []),

			// Sibling pages
			...range(siblingsStart, siblingsEnd),

			// End ellipsis
			// eslint-disable-next-line no-nested-ternary
			...(siblingsEnd < last - boundaryCount - 1
				? [-2]
				: last - boundaryCount > boundaryCount
				? [last - boundaryCount]
				: []),

			...endPages
		];

		return itemList;
	};

	$: IN_RANGE = $query.data
		? getInRange(data.page, $query.data.last, BOUNDARY_COUNT, SIBLING_COUNT)
		: [];
</script>

<div class="border-b xl:max-w-7xl border-mauve-6">
	<h3><VisuallyHidden.Root>Sub Menu</VisuallyHidden.Root></h3>

	<!--div class="flex p-2 space-x-2 border-t border-mauve-6">
		<a
			href="/experimental/dreams?page={pagable.previous}"
			class="bg-white border rounded-full border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
		>
			<div class="p-2">
				<AccessibleIcon label="Go to previous">
					<West />
				</AccessibleIcon>
			</div>
		</a>

		{#each IN_IN_RANGE as i (i)}
			<a
				href={i >= 0 ? '/experimental/dreams?page=' + i : undefined}
				class="flex-grow border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 bg-white aria-current-page:bg-purple-5"
				aria-current={pagable.current === i ? 'page' : undefined}
				aria-label={pagable.current === i ? `Page ${i}` : undefined}
			>
				<div class="px-4 py-2">
					<Headline as="h2" unstyled type="secondary">
						{#if pagable.current !== i && i >= 0}
							<VisuallyHidden.Root>Page</VisuallyHidden.Root>
						{/if}
						{i < 0 ? '...' : i}
					</Headline>
				</div>
			</a>
		{/each}

		<a
			href="/experimental/dreams?page={pagable.next}"
			class="bg-white border rounded-full border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
		>
			<div class="p-2">
				<AccessibleIcon label="Go to previous">
					<East />
				</AccessibleIcon>
			</div>
		</a>
	</div-->
	<ul class="flex flex-wrap justify-end">
		{#if user}
			<li class="w-auto p-2 mr-auto list-none">
				<AddDreamForm {user} />
			</li>
		{/if}
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
									class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
								>
									<p class="h-4 text-xs">
										{#if $loginForm && 'invalidValues' in $loginForm && $loginForm.invalidValues?.default}
											{$loginForm.invalidValues.default}
										{/if}
									</p>
								</div>

								<div
									class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
								>
									<label
										for="email"
										class="px-4 py-1 text-xs border border-b-0 rounded-none border-mauve-12 ring-mauve-12 group-focus-within:ring-1"
									>
										E-Mail*
									</label>
									<input
										id="email"
										class="w-full px-4 py-2 border rounded-none border-mauve-12 group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent"
										name="email"
										autocomplete="email"
										enterkeyhint="send"
										placeholder="email@example.com"
										type="email"
										value={loginFormEmail}
										disabled={$loginFormState ===
											FORM_STATE.SUBMITTING}
									/>

									<p class="h-4 text-xs">
										{#if $loginForm && 'invalidValues' in $loginForm && $loginForm.invalidValues?.email}
											{$loginForm.invalidValues.email}
										{/if}
									</p>
								</div>

								<div
									class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
								>
									<label
										for="password"
										class="px-4 py-1 text-xs border border-b-0 rounded-none border-mauve-12 ring-mauve-12 group-focus-within:ring-1"
									>
										Password*
									</label>
									<input
										id="password"
										class="w-full px-4 py-2 border rounded-none border-mauve-12 group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent"
										name="password"
										autocomplete="password"
										enterkeyhint="send"
										placeholder="********"
										type="password"
										disabled={$loginFormState ===
											FORM_STATE.SUBMITTING}
										value={loginFormPassword}
									/>

									<p class="h-4 text-xs">
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

{#if $query.data}
	<Pagination
		currentPage={data.page}
		isLoading={$query.isFetching}
		pagable={$query.data}
		getHref={(i) => {
			return `/experimental/dreams?page=${i}`;
		}}
		onItemClick={(i) => {
			data.page = i;
			replaceStateWithQuery({ page: i.toString() });
		}}
		onItemPreload={(i) => {
			data.queryClient.prefetchQuery({
				queryKey: DREAMS_KEYS.page(data.size, i),
				queryFn: () => queryFn({ size: data.size, page: i })
			});
		}}
	/>
{/if}
<div class="relative mb-32 border-y border-mauve-6">
	<ul
		class="grid grid-cols-1 p-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-[masonry]"
	>
		{#if $query.data}
			{#each $query.data.rows as dream (dream.id)}
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
								{dream.emoji}
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
								class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
							>
								<p class="h-4 text-xs">
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
								class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
							>
								<label
									for="text"
									class="px-4 py-1 text-xs border border-b-0 rounded-none border-mauve-12 ring-mauve-12 group-focus-within:ring-1"
								>
									Wovon träumst du nachts?
								</label>
								<textarea
									name="text"
									id="text"
									class="w-full px-4 py-2 border rounded-none resize-none border-mauve-12 group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent"
									placeholder="Ganz viele Schafe..."
									value={editDreamId === dream.id
										? editDreamText
										: dream.text}
									disabled={$editDreamFormState ===
										FORM_STATE.SUBMITTING}
								/>

								<p class="h-4 text-xs">
									{#if $editDreamForm && 'invalidValues' in $editDreamForm && $editDreamForm.invalidValues?.text && editDreamId === dream.id}
										{$editDreamForm.invalidValues.text}
									{/if}
								</p>
							</div>
							<div
								class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
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
								<p class="h-4 text-xs">
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
								class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
							>
								<p class="h-4 text-xs">
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
								class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
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
		{/if}
	</ul>

	{#if $query.isFetching && $query.isPlaceholderData}
		<div
			class="absolute inset-0 flex items-center justify-center cursor-wait bg-white/50 icon-mauve-12"
		>
			{#each getLoadingEmojis() as emoji}
				<p class="m-4 text-4xl animate-loading-1">
					{emoji}
				</p>
			{/each}
		</div>
	{/if}
</div>
