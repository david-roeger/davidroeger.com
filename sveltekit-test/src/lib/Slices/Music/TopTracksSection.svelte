<script lang="ts">
	import * as Music from '$components/Music';
	import type { SpotifyTopTracksResponse } from 'src/routes/about/types';

	export let topTracksResponse: SpotifyTopTracksResponse;
	console.log(topTracksResponse);

	const valid = (() => {
		if (topTracksResponse.ok) return true;
		if (!topTracksResponse.ok) return false;
		return undefined;
	})();

	import Album from '$assets/Icons/24/Album.svg';
	import Artist from '$assets/Icons/24/Artist.svg';
</script>

{#if valid === true && 'items' in topTracksResponse.body}
	<Music.Root>
		{#each topTracksResponse.body.items as track (track.id)}
			<Music.Row class="flex">
				{#if track.album.images.length}
					<Music.Atom>
						<!--ExternalLink
                                href={
                                    track.external_urls.spotify
                                }
                                ghost
                            -->
						<Music.Image url={track.album.images[0].url} alt={`${track.album.name} Album Cover`} />
					</Music.Atom>
				{/if}
				<Music.Atom class="flex-1 min-w-0 p-2 border-l border-mauve-5">
					<Music.Detail
						subline={[track.artists.map((artist) => artist.name).join(', '), track.album.name]}
					>
						<!--ExternalLink href={track.external_urls.spotify}>
					</ExternalLink-->
						<Artist slot="subline" />
						{track.name}
						<Album slot="preline" />
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
