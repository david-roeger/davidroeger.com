<script context="module" lang="ts">
	type MetaData = {
		title: string;
		artist: string;
		album: string;
		artwork: {
			src: string;
			sizes: string;
			type: string;
		}[];
	};

	const players = new Set<HTMLAudioElement>();
	const metaDatas = new Set<MetaData>();

	export function stopAll() {
		players.forEach((p) => p.pause());
	}

	export function stopOther(player: HTMLAudioElement) {
		players.forEach((p) => {
			if (p !== player) {
				p.pause();
			}
		});
	}

	export function getMiniPlayerIndex(player: HTMLAudioElement) {
		const playersArray = Array.from(players);
		return playersArray.indexOf(player);
	}

	export function getMetaDataByIndex(index: number) {
		const metaDataArray = Array.from(metaDatas);
		return metaDataArray[index];
	}
</script>

<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { activePlayer } from './store';
	import type {
		MediaPlayerState,
		MiniPlayerContext
	} from '$provider/MiniPlayerProvider/types';

	export let src: string;

	export let previewImage: string;
	export let externalUrl: string;

	export let title: string;
	export let artist: string;
	export let album: string;
	export let artwork: {
		src: string;
		sizes: string;
		type: string;
	}[];

	const { registerPlayer, playPlayer, removePlayer } =
		getContext<MiniPlayerContext>('miniPlayer');

	const metaData = {
		title,
		artist,
		album,
		artwork
	};

	let id: string | undefined = undefined;
	const context = 'tracks';

	onMount(() => {
		id = registerPlayer({
			context,
			src,
			previewImage,
			externalUrl,
			metaData
		});
	});

	onDestroy(() => {
		if (id) {
			console.log('destroying', metaData.title);
			removePlayer({ id, context });
		}
	});
</script>

<div class="relative">
	<button
		class="absolute inset-0 w-full h-full bg-mauve-12/80 opacity-0 hover:opacity-100 transition-opacity"
		disabled={!id}
		on:click={async () => {
			if (id) {
				playPlayer({ id, context });
			}
		}}
	>
		▶️
	</button>
	<audio controls>
		<source {src} type="audio/mpeg" />
		<track kind="captions" />
	</audio>
	<slot />
</div>
