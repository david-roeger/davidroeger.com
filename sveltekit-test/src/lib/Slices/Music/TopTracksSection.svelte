<script lang="ts">
	import * as Music from '$components/Music';
	import { Link } from '$components/Link';
	import type { SpotifyTopTracksResponse, Image } from 'src/routes/about/types';

	export let topTracksResponse: SpotifyTopTracksResponse;
	console.log(topTracksResponse);

	const valid = (() => {
		if (topTracksResponse.ok) return true;
		if (!topTracksResponse.ok) return false;
		return undefined;
	})();

	import Album from '$assets/Icons/24/Album.svg';
	import Artist from '$assets/Icons/24/Artist.svg';

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

{#if valid === true && 'items' in topTracksResponse.body}
	<Music.Root>
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
						<Artist slot="preline" />
						<Link href={track.external_urls.spotify}>
							{track.name}
						</Link>
						<Album slot="subline" />
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
