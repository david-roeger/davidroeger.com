<script lang="ts">
	import * as Music from '$components/Music';
	import { Link } from '$components/Link';
	import AccessibleIcon from '$components/AccessibleIcon';
	import Album from '$assets/Icons/24/album.svg';
	import Artist from '$assets/Icons/24/artist.svg';
	import Wave from '$components/Wave/Wave.svelte';

	import type {
		SpotifyLastTrackResponse,
		Image,
	} from '$components/Music/types';
	export let lastTrackResponse: SpotifyLastTrackResponse;
	let c = '';
	export { c as class };
	export let labelledby: string | undefined = undefined;

	const track =
		'item' in lastTrackResponse.body
			? lastTrackResponse.body.item
			: undefined;

	const valid = (() => {
		if (lastTrackResponse.ok) return true;
		if (!lastTrackResponse.ok) return false;
		return undefined;
	})();

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
</script>

<section class={c}>
	{#if valid === true && 'item' in lastTrackResponse.body}
		<Music.Root {labelledby}>
			<Music.Row class="flex">
				{#if track.album.images.length}
					<Music.Atom>
						<Link href={track.external_urls.spotify} type="ghost">
							<Music.Image
								url={getImageUrl(track.album.images)}
								alt="{track.album.name} Album Cover"
							/>
						</Link>
					</Music.Atom>
				{/if}
				<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
					<Music.Detail
						subline={[
							track.artists
								.map((artist) => artist.name)
								.join(', '),
							track.album.name,
						]}
					>
						<AccessibleIcon label="Artist:" slot="preline">
							<Artist />
						</AccessibleIcon>
						<Link href={track.external_urls.spotify}>
							{track.name}
						</Link>
						<div slot="headline">
							{#if 'is_playable' in track}
								<AccessibleIcon label="Currently Playing:">
									<Wave
										fill={[
											'icon-green-9',
											'icon-green-9',
											'icon-green-9',
											'icon-green-9',
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
		</Music.Root>
	{:else if valid === false && 'error' in lastTrackResponse.body}
		<Music.Root {labelledby}>
			<Music.Row class="flex">
				<Music.Atom>
					<div
						class="h-[68px] md:h-[92px] w-[68px] md:w-[92px] bg-purple-3"
					/>
				</Music.Atom>
				<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
					<Music.Detail subline={['', '']}>
						{#if typeof lastTrackResponse.body.error === 'string'}
							<p>Error:</p>
							<p>{lastTrackResponse.body.error}</p>
						{:else if typeof lastTrackResponse === 'object'}
							<p class="text-xs">Error:</p>
							<p class="text">
								{lastTrackResponse.body.error.status}
								{lastTrackResponse.body.error.message}
							</p>
						{/if}
					</Music.Detail>
				</Music.Atom>
			</Music.Row>
		</Music.Root>
	{/if}
</section>