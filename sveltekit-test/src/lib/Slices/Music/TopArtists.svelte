<script lang="ts">
	import * as Music from '$components/Music';
	import { Link } from '$components/Link';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import Tag from '$assets/icons/24/tag.svg';
	import Score from '$assets/icons/24/score.svg';
	import type { SpotifyTopArtistsResponse, Image } from '$components/Music/types';

	export let topArtistsResponse: SpotifyTopArtistsResponse;
	let c = '';
	export { c as class };
	export let labelledby = '';

	const valid = (() => {
		if (topArtistsResponse.ok) return true;
		if (!topArtistsResponse.ok) return false;
		return undefined;
	})();

	const getImageUrl = (images: Image[]): string => {
		if (images.length === 0) return '';

		const targetSize = 92;
		const currentSize = images[0].height;
		let targetIndex = 0;

		for (let i = 1; i < images.length; i++) {
			const image = images[i];
			if (image.height > 92 && image.height - targetSize < currentSize - targetSize) {
				targetIndex = i;
			}
		}

		return images[targetIndex].url;
	};
</script>

<section class={c}>
	{#if valid === true && 'items' in topArtistsResponse.body}
		<Music.Root {labelledby}>
			{#each topArtistsResponse.body.items as artist (artist.id)}
				<Music.Row class="flex">
					{#if artist.images.length}
						<Music.Atom>
							<Link href={artist.external_urls.spotify} type="ghost">
								<Music.Image url={getImageUrl(artist.images)} alt={`${artist.name}`} /></Link
							>
						</Music.Atom>
					{/if}
					<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
						<Music.Detail subline={[artist.genres.join(', '), `${artist.popularity} / 100`]}>
							<AccessibleIcon label="Genres:" slot="preline">
								<Tag />
							</AccessibleIcon>
							<Link href={artist.external_urls.spotify}>
								{artist.name}
							</Link>
							<AccessibleIcon label="Score:" slot="subline">
								<Score />
							</AccessibleIcon>
						</Music.Detail>
					</Music.Atom>
				</Music.Row>
			{/each}
		</Music.Root>
	{:else if valid === false && 'error' in topArtistsResponse.body}
		<Music.Root {labelledby}>
			<Music.Row class="flex">
				<Music.Atom>
					<div class="h-[68px] md:h-[92px] w-[68px] md:w-[92px] bg-purple-3" />
				</Music.Atom>
				<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
					<Music.Detail subline={['', '']}>
						{#if typeof topArtistsResponse.body.error === 'string'}
							<p>Error:</p>
							<p>{topArtistsResponse.body.error}</p>
						{:else if typeof topArtistsResponse === 'object'}
							<p class="text-xs">Error:</p>
							<p class="text">
								{topArtistsResponse.body.error.status}
								{topArtistsResponse.body.error.message}
							</p>
						{/if}
					</Music.Detail>
				</Music.Atom>
			</Music.Row>
		</Music.Root>
	{/if}
</section>
