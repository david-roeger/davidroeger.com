<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Music from '$components/Music';
	import { Link } from '$components/Link';
	import { AccessibleIcon } from '$components/AccessibleIcon';
	import Tag from '$assets/Icons/24/tag.svg?component';
	import type {
		TopArtist as TopArtistType,
		Image
	} from '$components/Music/types';
	import { MUSIC_KEYS, type Range } from '$routes/about/music/constants';
	import { Score } from '$components/Score';
	export let range: Range;

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
		await fetch(`/_api/music?type=artists&range=${range}`).then(
			async (res) => {
				const data = await res.json();
				if (!res.ok) throw data;
				return data as TopArtistType[];
			}
		);

	$: query = createQuery({
		queryKey: MUSIC_KEYS.range('artists', range),
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
							<p class="text-xs text-mauve-11">
								Loading artists:
							</p>
							<p>Waiting for data...</p>
						</Music.Detail>
					</Music.Atom>
				</Music.Row>
			{/each}
		</Music.Root>
	{:else if $query.data}
		{@const topArtists = $query.data}
		<Music.Root {labelledby}>
			{#each topArtists as artist (artist.id)}
				<Music.Row class="flex">
					{#if artist.images.length}
						<Music.Atom>
							<Link
								href={artist.external_urls.spotify}
								type="ghost"
							>
								<Music.Image
									url={getImageUrl(artist.images)}
									alt={artist.name}
								/>
							</Link>
						</Music.Atom>
					{:else}
						<Music.Atom
							class="h-[64px] md:h-[88px] w-[64px] md:w-[88px] object-cover bg-purple-3"
						/>
					{/if}
					<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
						<Music.Detail
							subline={[
								artist.genres.join(', '),
								`${artist.popularity} / 100`
							]}
						>
							<AccessibleIcon label="Genres:" slot="preline">
								<Tag />
							</AccessibleIcon>
							<Link href={artist.external_urls.spotify}>
								{artist.name}
							</Link>
							<AccessibleIcon label="Popularity:" slot="subline">
								<Score score={artist.popularity} />
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
