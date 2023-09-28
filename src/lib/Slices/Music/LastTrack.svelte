<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Music from '$components/Music';
	import { Link } from '$components/Link';
	import { AccessibleIcon } from '$components/AccessibleIcon';
	import Album from '$assets/Icons/24/album.svg?component';
	import Artist from '$assets/Icons/24/artist.svg?component';
	import { Wave } from '$components/Wave';
	import type {
		LastTrack as LastTrackType,
		Image
	} from '$components/Music/types';
	import { Slide } from '$components/Slide';

	import { MUSIC_KEYS } from '$routes/about/music/constants';

	import MiniPlayer from '$components/MiniPlayer/MiniPlayer.svelte';

	let c = '';
	export { c as class };
	export let labelledby: string | undefined = undefined;

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
		await fetch('/_api/music?type=lastTrack').then(async (res) => {
			const data = await res.json();
			if (!res.ok) throw data;
			return data as LastTrackType;
		});

	const query = createQuery({
		queryKey: MUSIC_KEYS.type('lastTrack'),
		queryFn,
		refetchOnMount: true,
		refetchOnWindowFocus: 'always',
		refetchInterval: 1000 * 30 // 30 seconds
	});
</script>

<section class={c}>
	{#if $query.isLoading}
		<Music.Root {labelledby}>
			<Music.Row class="flex">
				<Music.Atom>
					<div
						class="h-[64px] md:h-[88px] w-[64px] md:w-[88px] bg-purple-3"
					/>
				</Music.Atom>
				<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
					<Music.Detail subline={['', '']}>
						<p class="text-xs text-mauve-11">Loading:</p>
						<p>Waiting for data...</p>
					</Music.Detail>
				</Music.Atom>
			</Music.Row>
		</Music.Root>
	{:else if $query.data}
		{@const lastTrack = $query.data}
		<Music.Root {labelledby}>
			<Slide as="li" key={lastTrack.id}>
				<Music.Row as="div" class="flex group/miniplayer">
					{#if lastTrack.album.images.length}
						<Music.Atom>
							{#if lastTrack.preview_url}
								<MiniPlayer
									previewImage={getImageUrl(
										lastTrack.album.images
									)}
									externalUrl={lastTrack.external_urls
										.spotify}
									src={lastTrack.preview_url}
									title={lastTrack.name}
									artist={lastTrack.artists
										.map((artist) => artist.name)
										.join(', ')}
									album={lastTrack.album.name}
									artwork={lastTrack.album.images.map(
										(image) => ({
											src: image.url,
											sizes: `${image.width}x${image.height}`,
											type: 'image/jpeg'
										})
									)}
									context="lastTrack"
								>
									<Music.Image
										url={getImageUrl(
											lastTrack.album.images
										)}
										alt="{lastTrack.album.name} Album Cover"
									/>
								</MiniPlayer>
							{:else}
								<Link
									href={lastTrack.external_urls.spotify}
									type="ghost"
								>
									<Music.Image
										url={getImageUrl(
											lastTrack.album.images
										)}
										alt="{lastTrack.album.name} Album Cover"
									/>
								</Link>
							{/if}
						</Music.Atom>
					{:else}
						<Music.Atom>
							{#if lastTrack.preview_url}
								<MiniPlayer
									previewImage={getImageUrl(
										lastTrack.album.images
									)}
									externalUrl={lastTrack.external_urls
										.spotify}
									src={lastTrack.preview_url}
									title={lastTrack.name}
									artist={lastTrack.artists
										.map((artist) => artist.name)
										.join(', ')}
									album={lastTrack.album.name}
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
								lastTrack.artists
									.map((artist) => artist.name)
									.join(', '),
								lastTrack.album.name
							]}
						>
							<AccessibleIcon label="Artist:" slot="preline">
								<Artist />
							</AccessibleIcon>
							<Link href={lastTrack.external_urls.spotify}>
								{lastTrack.name}
							</Link>
							<div
								slot="headline"
								hidden={!('is_playable' in lastTrack)}
							>
								{#if 'is_playable' in lastTrack}
									<AccessibleIcon label="Currently Playing:">
										<Wave
											fill={[
												'icon-green-7',
												'icon-green-7',
												'icon-green-7',
												'icon-green-7'
											]}
										/>
									</AccessibleIcon>
								{/if}
							</div>
							<AccessibleIcon label="Album:" slot="subline">
								<Album />
							</AccessibleIcon>
						</Music.Detail>
					</Music.Atom>
				</Music.Row>
			</Slide>
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
