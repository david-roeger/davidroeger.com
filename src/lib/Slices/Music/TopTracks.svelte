<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Music from '$components/Music';
	import { Link } from '$components/Link';
	import { AccessibleIcon } from '$components/AccessibleIcon';
	import type {
		TopTrack as TopTrackType,
		Image
	} from '$components/Music/types';
	import { MiniPlayer } from '$components/MiniPlayer';

	import Album from '$assets/Icons/24/album.svg?component';
	import Artist from '$assets/Icons/24/artist.svg?component';

	import { MUSIC_KEYS, type Range } from '$routes/about/music/constants';
	import Mp from '$components/MiniPlayer/Mp.svelte';

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
		await fetch(`/_api/music?type=tracks&range=${range}`).then(
			async (res) => {
				const data = await res.json();
				if (!res.ok) throw data;
				return data as TopTrackType[];
			}
		);

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
							class="h-[64px] md:h-[88px] w-[64px] md:w-[88px] bg-purple-3"
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
			{#each topTracks as track, index (track.id)}
				<Music.Row class="flex group/miniplayer">
					{#if track.album.images.length}
						<Music.Atom>
							{#if track.preview_url}
								<MiniPlayer
									previewImage={getImageUrl(
										track.album.images
									)}
									externalUrl={track.external_urls.spotify}
									src={track.preview_url}
									title={track.name}
									artist={track.artists
										.map((artist) => artist.name)
										.join(', ')}
									album={track.album.name}
									artwork={track.album.images.map(
										(image) => ({
											src: image.url,
											sizes: `${image.width}x${image.height}`,
											type: 'image/jpeg'
										})
									)}
								>
									<Music.Image
										url={getImageUrl(track.album.images)}
										alt="{track.album.name} Album Cover"
									/>
								</MiniPlayer>
							{:else}
								<Link
									href={track.external_urls.spotify}
									type="ghost"
								>
									<Music.Image
										url={getImageUrl(track.album.images)}
										alt="{track.album.name} Album Cover"
									/>
								</Link>
							{/if}
						</Music.Atom>
					{:else}
						<Music.Atom>
							{#if track.preview_url}
								<MiniPlayer
									previewImage={getImageUrl(
										track.album.images
									)}
									externalUrl={track.external_urls.spotify}
									src={track.preview_url}
									title={track.name}
									artist={track.artists
										.map((artist) => artist.name)
										.join(', ')}
									album={track.album.name}
									artwork={[]}
								>
									<div
										class="h-[64px] md:h-[88px] w-[64px] md:w-[88px] bg-purple-3"
									/>
								</MiniPlayer>
							{:else}
								<div
									class="h-[64px] md:h-[88px] w-[64px] md:w-[88px] bg-purple-3"
								/>
							{/if}
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
							<span slot="headline">
								{index + 1}.
							</span>
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
						class="h-[64px] md:h-[88px] w-[64px] md:w-[88px] bg-purple-3"
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
