<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Music from '$components/Music';
	import { Link } from '$components/Link';
	import { AccessibleIcon } from '$components/AccessibleIcon';
	import Album from '$assets/Icons/24/album.svg?component';
	import Artist from '$assets/Icons/24/artist.svg?component';
	import type {
		TopTrack as TopTrackType,
		Image
	} from '$components/Music/types';
	import { MUSIC_KEYS, type Range } from '$routes/about/music/constants';

	export let range: Range;

	let c = '';
	export { c as class };
	export let labelledby: string | undefined = '';

	const getImageUrl = (images: Image[]): string => {
		if (images.length === 0) return '';

		const targetSize = 92;
		const currentSize = images[0].height;
		let targetIndex = 0;

		for (let i = 1; i < images.length; i++) {
			const image = images[i];
			if (
				image.height > 92 &&
				image.height - targetSize < currentSize - targetSize
			) {
				targetIndex = i;
			}
		}

		return images[targetIndex].url;
	};

	const queryFn = async () =>
		(await fetch(`/_api/music?type=tracks&range=${range}`))
			.json()
			.then((data) => data as TopTrackType[]);

	$: query = createQuery({
		queryKey: MUSIC_KEYS.range('tracks', range),
		queryFn
	});
</script>

<section class={c}>
	{#if $query.isLoading}
		<Music.Root {labelledby}>
			{#each { length: 8 } as _, i (i)}
				<Music.Row class="flex">
					<Music.Atom>
						<div
							class="h-[68px] md:h-[92px] w-[68px] md:w-[92px] bg-purple-3"
						/>
					</Music.Atom>
					<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
						<Music.Detail subline={['', '']}>
							<p class="text-xs text-mauve-11">Loading tracks:</p>
							<p>Waiting for data...</p>
						</Music.Detail>
					</Music.Atom>
				</Music.Row>
			{/each}
		</Music.Root>
	{:else if $query.data}
		{@const topTracks = $query.data}
		<Music.Root {labelledby}>
			{#each topTracks as track (track.id)}
				<Music.Row class="flex">
					{#if track.album.images.length}
						<Music.Atom>
							<Link
								href={track.external_urls.spotify}
								type="ghost"
							>
								<Music.Image
									url={getImageUrl(track.album.images)}
									alt="{track.album.name} Album Cover"
								/>
							</Link>
						</Music.Atom>
					{:else}
						<Music.Atom>
							<div
								class="h-[68px] md:h-[92px] w-[68px] md:w-[92px] bg-purple-3"
							/>
						</Music.Atom>
					{/if}
					<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
						<Music.Detail
							subline={[
								track.artists
									.map((artist) => artist.name)
									.join(', '),
								track.album.name
							]}
						>
							<AccessibleIcon label="Artist:" slot="preline">
								<Artist />
							</AccessibleIcon>
							<Link href={track.external_urls.spotify}>
								{track.name}
							</Link>
							<AccessibleIcon label="Album:" slot="subline">
								<Album />
							</AccessibleIcon>
						</Music.Detail>
					</Music.Atom>
				</Music.Row>
			{/each}
		</Music.Root>
	{:else}
		<Music.Root {labelledby}>
			<Music.Row class="flex">
				<Music.Atom>
					<div
						class="h-[68px] md:h-[92px] w-[68px] md:w-[92px] bg-purple-3"
					/>
				</Music.Atom>
				<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
					<Music.Detail subline={['', '']}>
						<p class="text-xs text-mauve-11">Error:</p>
						<p>Something went wrong. Please try again later</p>
					</Music.Detail>
				</Music.Atom>
			</Music.Row>
		</Music.Root>
	{/if}
</section>
