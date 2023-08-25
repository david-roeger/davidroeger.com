<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import type {
		MediaPlayerState,
		MiniPlayerContext
	} from '$provider/MiniPlayerProvider/types';
	import { derived, writable, type Readable } from 'svelte/store';
	import Playing from '$components/SvelteIcons/Playing.svelte';
	import Button from '$components/Button/Button.svelte';

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

	const { register, play, pause, remove, state } =
		getContext<MiniPlayerContext>('miniPlayer');

	const metaData = {
		title,
		artist,
		album,
		artwork
	};

	const id = writable<string>();
	const context = 'tracks';

	onMount(() => {
		$id = register({
			context,
			src,
			previewImage,
			externalUrl,
			metaData
		});
	});

	onDestroy(() => {
		console.log('destroy');
		if ($id) {
			remove({ id: $id, context });
		}
	});

	const current = derived([id, state], ([$id, $s]) => {
		const $state = $s as {
			context?: string | undefined;
			currentId?: string | undefined;
			state: MediaPlayerState;
		};
		if ($id && $id === $state.currentId) {
			return $state;
		}
	});

	$: isShowing = $current ? true : false;
	$: isPlaying = $current && $current.state === 'playing' ? true : false;
</script>

<div class="relative flex">
	<button
		class="text-white absolute h-[68px] md:h-[92px] w-[68px] md:w-[92px] bg-mauve-12/80 opacity-0 hover:opacity-100 transition-opacity"
		disabled={!id}
		on:click={async () => {
			if ($id) {
				if (!isPlaying) {
					play({ id: $id, context });
				} else {
					pause({ id: $id, context });
				}
			}
		}}
	>
		{isPlaying ? '◼︎' : '▶︎'}
	</button>
	<slot />
	<div>
		<Playing show={isShowing} play={isPlaying} />
	</div>
</div>
