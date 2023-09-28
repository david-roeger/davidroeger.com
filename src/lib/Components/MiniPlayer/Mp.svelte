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
	import { onDestroy, onMount } from 'svelte';
	import { activePlayer } from './store';
	import { browser } from '$app/environment';

	export let src: string;

	export let title: string;
	export let artist: string;
	export let album: string;
	export let artwork: {
		src: string;
		sizes: string;
		type: string;
	}[];

	let state: 'idle' | 'loading' | 'ready' | 'playing' | 'paused' = browser
		? 'idle'
		: 'loading';

	const metaData = {
		title,
		artist,
		album,
		artwork
	};

	let player: HTMLAudioElement;

	function playerReady() {
		if (player.readyState === 4 || player.readyState === 3) {
			return true;
		}
		return false;
	}
	function updatePositionState(p: HTMLAudioElement) {
		if ('setPositionState' in navigator.mediaSession) {
			navigator.mediaSession.setPositionState({
				duration: p.duration,
				playbackRate: p.playbackRate,
				position: p.currentTime
			});
		}
	}

	function updateMetadata(p: HTMLAudioElement) {
		const index = getMiniPlayerIndex(p);
		const md = getMetaDataByIndex(index);
		navigator.mediaSession.metadata = new MediaMetadata(md);
	}

	onMount(() => {
		players.add(player);
		metaDatas.add(metaData);
		if ('mediaSession' in navigator) {
			navigator.mediaSession.setActionHandler('play', async () => {
				if ($activePlayer) {
					await $activePlayer.play();
					updateMetadata($activePlayer);
					updatePositionState($activePlayer);
				}
			});

			navigator.mediaSession.setActionHandler('pause', () => {
				if ($activePlayer) {
					$activePlayer.pause();
				}
			});

			navigator.mediaSession.setActionHandler('nexttrack', async () => {
				if (!$activePlayer) return;
				const playersArray = Array.from(players);
				const currentIndex = playersArray.indexOf($activePlayer);
				const nextIndex =
					currentIndex + 1 > playersArray.length - 1
						? 0
						: currentIndex + 1;
				const nextPlayer = playersArray[nextIndex];
				if (nextPlayer) {
					nextPlayer.currentTime = 0;
					$activePlayer.currentTime = 0;
					await nextPlayer.play();
					updateMetadata(nextPlayer);
					updatePositionState(nextPlayer);
				}
			});

			navigator.mediaSession.setActionHandler(
				'previoustrack',
				async () => {
					if (!$activePlayer) return;
					const playersArray = Array.from(players);
					const currentIndex = playersArray.indexOf($activePlayer);
					const previousIndex =
						currentIndex - 1 < 0
							? playersArray.length - 1
							: currentIndex - 1;
					const previousPlayer = playersArray[previousIndex];

					if (previousPlayer) {
						previousPlayer.currentTime = 0;
						$activePlayer.currentTime = 0;
						await previousPlayer.play();
						updateMetadata(previousPlayer);
						updatePositionState(previousPlayer);
					}
				}
			);

			navigator.mediaSession.setActionHandler('seekto', (details) => {
				if (!$activePlayer) return;
				const to = details.seekTime ?? 0;
				$activePlayer.currentTime = to;
				$activePlayer.play();
			});
		}
	});

	onDestroy(() => {
		players.delete(player);

		if ($activePlayer === player) {
			$activePlayer = null;
		}
	});

	const handlePlay = (e: Event) => {
		$activePlayer = player;
		stopOther(player);
		if ('mediaSession' in navigator) {
			navigator.mediaSession.playbackState = 'playing';
			updateMetadata(player);
			updatePositionState(player);
		}
		// e.preventDefault();
		player.play().then(() => {
			state = 'playing';
		});
	};

	const handlePause = () => {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.playbackState = 'paused';
		}
		state = 'paused';
	};

	const handleEnded = () => {
		player.currentTime = 0;
		state = 'ready';
	};

	$: console.log(state);
</script>

<audio preload="metadata" bind:this={player} controls>
	<source src="{src.split('?')[0]}.mp3" type="audio/mpeg" />
	<track kind="captions" />
</audio>

<div class="relative">
	<button
		class="absolute inset-0 w-full h-full bg-mauve-12/80 opacity-0 hover:opacity-100 transition-opacity"
		disabled={state === 'loading'}
		on:click={async () => {
			if (state === 'idle' || state === 'ready' || state === 'paused') {
				const ready = playerReady();
				if (!ready) {
					state = 'loading';
				} else {
					state = 'playing';
				}
				player.play();
			} else if (state === 'playing') {
				player.pause();
			}
		}}
	>
		{#if state === 'loading'}
			🌀
		{:else if state === 'playing'}
			⏸
		{:else}
			▶️
		{/if}
	</button>
	<slot />
</div>
