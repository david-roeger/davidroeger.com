<script lang="ts">
	logger.page('about/music: +page.svelte');
	// ----------------------------------------------------------------

	import * as Tabs from '$primitives/Tabs';
	import * as Popper from '$primitives/Popper';
	import * as RadioGroup from '$primitives/RadioGroup';

	import { Headline } from '$components/Headline';
	import { Link } from '$components/Link';
	import { AccessibleIcon } from '$components/AccessibleIcon';

	import { TopTracks, TopArtists, LastTrack } from '$slices/Music';

	import Filter from '$assets/Icons/24/filter.svg?component';
	import Close from '$assets/Icons/24/close.svg?component';

	import { preload } from '$actions/preload';

	import { toBase64 } from '$utils';
	import { logger } from '$utils/logger';
	import { queryParam } from '$utils/Store/queryParam';

	import Spinner from '$assets/Icons/24/spinner.svg?component';

	import {
		type S,
		timeRanges,
		tabSchema,
		rangeSchema,
		createStateFromParam,
		type Range,
		type Tab,
		MUSIC_KEYS
	} from './constants';
	// ----------------------------------------------------------------

	import type { PageData } from './$types';
	import { Slide } from '$components/Slide';
	import { createQuery } from '@tanstack/svelte-query';
	import Playing from '$components/SvelteIcons/Playing.svelte';
	export let data: PageData;

	const queryStore = queryParam('s', {
		// base64 encode string
		encode: (value: S) =>
			toBase64(JSON.stringify(value).replaceAll(' ', '')),
		decode: (value: string | null) => createStateFromParam(value)
	});

	const queryFn = (tab: Tab, range: Range) =>
		fetch(`/_api/music?type=${tab}&range=${range}`).then(async (res) => {
			const data = await res.json();
			if (!res.ok) throw data;
			return data;
		});

	$: store = $queryStore ?? data.initalState;

	const query = createQuery({
		queryKey: MUSIC_KEYS.type('lastTrack')
	});
</script>

<Headline containerClass="flex items-end py-8 md:py-16">
	<span aria-hidden="true" class="select-none">::</span>
	Favorite Music
</Headline>

<Headline
	as="h2"
	type="quaternary"
	id="current_track"
	containerClass="p-2 bg-white border-b border-mauve-6"
	class="flex space-x-1"
>
	<AccessibleIcon label={$query.isFetching ? 'loading' : ''}>
		<Spinner class={$query.isFetching ? 'animate-loading-1' : ''} />
	</AccessibleIcon>
	<span>Last listened on Spotify</span>
</Headline>

<LastTrack
	labelledby="current_track"
	class="border-b bg-white/[.85] border-mauve-6 mb-8 md:mb-16"
/>

<Tabs.Root
	defaultValue={data.initalState.tab}
	on:valueChange={(e) => {
		const tab = tabSchema.safeParse(e.detail.value);
		if (tab.success) {
			console.log(tab);
			queryStore.update((s) => {
				const last = s ?? data.initalState;
				return { ...last, tab: tab.data };
			});
		}
	}}
>
	<p class="p-2 bg-white border-t border-mauve-6">
		Favorite on Spotify <span class="text-mauve-11">
			({timeRanges[store.range].label})
		</span>
	</p>

	<div class="flex p-2 border-t space-x-2 border-mauve-6">
		<Tabs.List
			ariaLabel="My Favorite Artists and Tracks on Spotify"
			class="flex w-full space-x-2"
		>
			<Tabs.Trigger
				value="tracks"
				class="flex-grow border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 rounded-l-full {store.tab ===
				'tracks'
					? 'bg-purple-5'
					: 'bg-white'}"
			>
				<div class="px-4 py-2">
					<Headline as="h2" unstyled id="top_tracks" type="secondary">
						Tracks
					</Headline>
				</div>
			</Tabs.Trigger>

			<Tabs.Trigger
				value="artists"
				class="flex-grow border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 rounded-r-full {store.tab ===
				'artists'
					? 'bg-purple-5'
					: 'bg-white'}"
			>
				<div class="px-4 py-2">
					<Headline
						as="h2"
						unstyled
						type="secondary"
						id="top_artists"
					>
						Artists
					</Headline>
				</div>
			</Tabs.Trigger>
		</Tabs.List>
		<Popper.Root defaultOpen={false}>
			<Popper.Trigger
				class="p-2 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
			>
				<AccessibleIcon label="Filter Favorites">
					<Filter />
				</AccessibleIcon>
			</Popper.Trigger>
			<Popper.Content
				class="bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
				side="bottom"
				align="end"
				sideOffset={8}
				alignOffset={0}
				avoidCollision={false}
			>
				<Headline
					as="h2"
					id="timeHeadline"
					type="tertiary"
					class="border-b-0"
				>
					Time Range
				</Headline>

				<RadioGroup.Root
					defaultValue={timeRanges[store.range].value}
					required
					name="time"
					labelledby="timeHeadline"
					orientation="vertical"
					class="p-2"
					on:valueChange={(e) => {
						const range = rangeSchema.safeParse(e.detail.value);
						if (range.success) {
							queryStore.update((s) => {
								const last = s ?? data.initalState;
								return { ...last, range: range.data };
							});
						}
					}}
				>
					{#each Object.values(timeRanges) as range}
						<div
							class="flex mb-2 space-x-2 last:mb-0 group"
							use:preload
							on:preload={() => {
								data.queryClient.prefetchQuery({
									queryKey: MUSIC_KEYS.range(
										'tracks',
										range.value
									),
									queryFn: () =>
										queryFn('tracks', range.value)
								});
								data.queryClient.prefetchQuery({
									queryKey: MUSIC_KEYS.range(
										'artists',
										range.value
									),
									queryFn: () =>
										queryFn('artists', range.value)
								});
							}}
						>
							<RadioGroup.Item
								value={range.value}
								id="timerange-{range.value}"
								class="relative w-6 h-6 p-1 bg-white border rounded-full b border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 before:absolute before:inset-0 before:block before:m-1 before:rounded-full group-hover:before:bg-mauve-5 before:transition-colors"
							>
								<RadioGroup.Indicator
									class="absolute inset-0 block m-1 rounded-full bg-plum-5"
								/>
							</RadioGroup.Item>
							<label
								for="timerange-{range.value}"
								class="cursor-pointer"
							>
								{range.label}
							</label>
						</div>
					{/each}
				</RadioGroup.Root>

				<Popper.Close
					class="bg-white absolute top-0 right-0 p-2 -translate-y-[51px] translate-x-[1px] border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
				>
					<AccessibleIcon label="Close Popover">
						<Close />
					</AccessibleIcon>
				</Popper.Close>
			</Popper.Content>
		</Popper.Root>
	</div>
	<Tabs.Content
		value="tracks"
		class="border-t border-b bg-white/[.85] border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1"
	>
		<TopTracks labelledby="top_tracks" range={store.range} />
	</Tabs.Content>
	<Tabs.Content
		value="artists"
		class="border-t border-b bg-white/[.85] border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1"
	>
		<TopArtists labelledby="top_artists" range={store.range} />
	</Tabs.Content>
</Tabs.Root>

<div class="pt-8 mb-32 text-center md:pt-16">
	<p>Made with:</p>
	<p>
		<Link type="secondary" href="https://spotify.com">Spotify 💚</Link>
	</p>
</div>
