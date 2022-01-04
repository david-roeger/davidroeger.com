<script lang="ts">
	import * as Music from '$components/Music';
	import { Link } from '$components/Link';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import Tag from '$assets/Icons/24/Tag.svg';
	import Score from '$assets/Icons/24/Score.svg';
	import type { SpotifyTopArtistsResponse, Image } from 'src/routes/about/types';

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
					<Music.Atom class="flex-1 min-w-0 border-l border-mauve-5">
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
		{#if typeof topArtistsResponse.body.error === 'string'}
			<p>{topArtistsResponse.body.error}</p>
		{:else if typeof topArtistsResponse === 'object'}
			<p>{topArtistsResponse.body.error.status} {topArtistsResponse.body.error.message}</p>
		{/if}
	{/if}
</section>
