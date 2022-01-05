<script lang="ts">
	import * as Music from '$components/Music';
	import { Link } from '$components/Link';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import Album from '$assets/Icons/24/album.svg';
	import Artist from '$assets/Icons/24/artist.svg';
	import type { SpotifyTopTracksResponse, Image } from '$components/Music/types';

	export let topTracksResponse: SpotifyTopTracksResponse;
	let c = '';
	export { c as class };
	export let labelledby = '';

	const valid = (() => {
		if (topTracksResponse.ok) return true;
		if (!topTracksResponse.ok) return false;
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
	{#if valid === true && 'items' in topTracksResponse.body}
		<Music.Root {labelledby}>
			{#each topTracksResponse.body.items as track (track.id)}
				<Music.Row class="flex">
					{#if track.album.images.length}
						<Music.Atom>
							<Link href={track.external_urls.spotify} type="ghost">
								<Music.Image
									url={getImageUrl(track.album.images)}
									alt={`${track.album.name} Album Cover`}
								/></Link
							>
						</Music.Atom>
					{/if}
					<Music.Atom class="flex-1 min-w-0 border-l border-mauve-5">
						<Music.Detail
							subline={[track.artists.map((artist) => artist.name).join(', '), track.album.name]}
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
	{:else if valid === false && 'error' in topTracksResponse.body}
		{#if typeof topTracksResponse.body.error === 'string'}
			<p>{topTracksResponse.body.error}</p>
		{:else if typeof topTracksResponse === 'object'}
			<p>{topTracksResponse.body.error.status} {topTracksResponse.body.error.message}</p>
		{/if}
	{/if}
</section>
