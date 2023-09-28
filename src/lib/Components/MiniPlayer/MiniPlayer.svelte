<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';

	import type {
		MediaPlayerState,
		MiniPlayerContext
	} from '$provider/MiniPlayerProvider/types';
	import { DEFAULT_PLAYER_CONTEXT } from '$provider/MiniPlayerProvider/constants';

	import { derived, writable } from 'svelte/store';
	import Playing from '$components/SvelteIcons/Playing.svelte';
	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';

	import Play from '$assets/Icons/24/play.svg?component';
	import Pause from '$assets/Icons/24/pause.svg?component';

	export let context = DEFAULT_PLAYER_CONTEXT;
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
	<div
		class:active={isShowing}
		class="bg-mauve-3 border-mauve-6 border-r flex items-center p-2 slider transition-[transform,margin-left]"
	>
		<button
			class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-pointer rounded-full"
			disabled={!id}
			on:click={async () => {
				if ($id) {
					if (!isPlaying) {
						console.log('play');
						play({ id: $id, context });
					} else {
						pause({ id: $id, context });
					}
				}
			}}
		>
			{#if isPlaying}
				<AccessibleIcon label="pause">
					<Pause />
				</AccessibleIcon>
			{:else}
				<AccessibleIcon label="play">
					<Play />
				</AccessibleIcon>
			{/if}
		</button>
	</div>

	<slot />
	<div>
		<Playing show={isShowing} play={isPlaying} />
	</div>
</div>

<style>
	:global(.slider) {
		transform: translateX(-51px);
		margin-left: -51px;
	}
	:global(.slider.active) {
		transform: translateX(0px);
		margin-left: 0px;
	}
	:global(.group\/miniplayer:hover .slider) {
		transform: translateX(0px);
		margin-left: 0px;
	}
	:global(.group\/miniplayer:focus-within .slider) {
		transform: translateX(0px);
		margin-left: 0px;
	}
</style>
