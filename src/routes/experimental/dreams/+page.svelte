<script lang="ts">
	logger.page('experimental/dreams:  +page.svelte');
	// ----------------------------------------------------------------

	import { derived, writable } from 'svelte/store';

	import {
		createQuery,
		keepPreviousData,
		useQueryClient
	} from '@tanstack/svelte-query';

	import * as VisuallyHidden from '$primitives/VisuallyHidden';

	import { Headline } from '$components/Headline';
	import type { Pageable } from '$components/Pagination/types';
	import { Pagination } from '$components/Pagination';
	import { Button } from '$components/Button';

	import { AddDreamForm } from '$slices/AddDreamForm';

	import { getLoadingEmojis, replaceStateWithQuery } from '$utils';
	import { logger } from '$utils/logger';

	import type { Dream } from '$types';

	import DreamComponent from './Dream.svelte';
	import { DREAMS_KEYS } from './constants';

	// ----------------------------------------------------------------
	import type { PageData } from './$types';

	export let data: PageData;

	const queryClient = useQueryClient();

	$: user = data.user;

	const queryFn = async ({ size, page }: { size: number; page: number }) =>
		await fetch(`/_api/dreams?size=${size}&page=${page}`).then(
			async (res) => {
				const data = await res.json();
				if (!res.ok) throw data;
				const dreams = data as Pageable<Dream>;
				dreams.rows.forEach((dream) => {
					queryClient.setQueryData(DREAMS_KEYS.id(dream.id), dream);
				});
				const rows = dreams.rows.map((dream) => dream.id);
				return {
					...dreams,
					rows
				};
			}
		);

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
			<ul class="flex flex-wrap justify-end p-1">
				{#if user}
					<li class="p-1 list-none">
						<form
							action="/experimental/dreams/logout"
							method="post"
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
					<!--li class="p-1 list-none">
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
					</li-->
				{/if}
			</ul>
		</li>
	</ul>
</div>

<Headline containerClass="py-8 md:py-16" class="flex">
	<span>Meine Träume</span>
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
			{#each $query.data.rows as id}
				<DreamComponent {id} />
			{:else}
				<li>No dreams recorded yet 😴</li>
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
