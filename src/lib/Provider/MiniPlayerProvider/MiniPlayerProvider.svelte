<script lang="ts">
	import { setContext, tick } from 'svelte';
	import { derived, get, writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	import { beforeNavigate } from '$app/navigation';

	import * as Progress from '$primitives/Progress';

	import { AccessibleIcon } from '$components/AccessibleIcon';
	import { Button } from '$components/Button';
	import * as Music from '$components/Music';
	import { Link } from '$components/Link';

	import Close from '$assets/Icons/16/close.svg?component';

	import East from '$assets/Icons/16/east.svg?component';
	import West from '$assets/Icons/16/west.svg?component';
	import Artist from '$assets/Icons/24/artist.svg?component';

	import { DEFAULT_PLAYER_CONTEXT } from './constants';

	import type {
		MiniPlayerContext,
		MiniPlayer,
		MediaPlayerState
	} from './types';
	import { tweened } from 'svelte/motion';
	import { Headline } from '$components/Headline';

	// ----------------------------------------------------------------

	const nestedMiniPlayers = writable<Record<string, Set<MiniPlayer>>>({
		[DEFAULT_PLAYER_CONTEXT]: new Set()
	});

	const currentState = writable<MediaPlayerState>('idle');
	const currentContext = writable<string>(DEFAULT_PLAYER_CONTEXT);
	const currentMiniPlayers = derived(
		[currentContext, nestedMiniPlayers],
		([$currentContext, $nestedMiniPlayers]) => {
			if (!$nestedMiniPlayers[$currentContext]) {
				const cmp = new Set<MiniPlayer>();
				$nestedMiniPlayers[$currentContext] = cmp;
				$nestedMiniPlayers = $nestedMiniPlayers;
				return cmp;
			}
			return $nestedMiniPlayers[$currentContext];
		}
	);

	const currentId = writable<string | undefined>(undefined);

	const currentMiniPlayer = derived(
		[currentId, currentMiniPlayers],
		([$currentId, $currentMiniPlayers]) =>
			Array.from($currentMiniPlayers).find((mp) => mp.id === $currentId)
	);

	const toBeRemoved = writable<{ id: string; context: string } | undefined>(
		undefined
	);

	let currentDuration = 0;
	let currentProgress = 0;
	const tweenedProgress = tweened(currentProgress, {
		duration: 100
	});

	const registerPlayer = ({
		context = DEFAULT_PLAYER_CONTEXT,
		src,
		metaData,
		externalUrl,
		previewImage
	}: // onStateChange
	Parameters<MiniPlayerContext['registerPlayer']>[0]) => {
		if (!$nestedMiniPlayers[context]) {
			$nestedMiniPlayers[context] = new Set();
		}

		const id = self.crypto.randomUUID();

		console.log('registerPlayer', context, id);
		const miniPlayer: MiniPlayer = {
			id,
			metaData,
			src,
			externalUrl,
			previewImage,
			element: undefined
			// onStateChange
		};

		$nestedMiniPlayers[context].add(miniPlayer);
		$nestedMiniPlayers = $nestedMiniPlayers;
		$currentContext = context;

		return id;
	};

	const playPlayer = ({
		context = DEFAULT_PLAYER_CONTEXT,
		id
	}: Parameters<MiniPlayerContext['playPlayer']>[0]) => {
		console.log('playPlayer', context, id);
		if (!$nestedMiniPlayers[context]) {
			throw new Error(
				`No mini players registered for context ${context}`
			);
		}

		$currentContext = context;
		$currentId = id;

		const miniPlayer = Array.from($nestedMiniPlayers[context]).find(
			(mp) => mp.id === id
		);

		if (!miniPlayer) {
			throw new Error(
				`No mini player with id ${id} found in context ${context}`
			);
		}

		if (!miniPlayer.element) {
			throw new Error(
				`No element found for mini player with id ${id} found in context ${context}`
			);
		}

		const ready = playerReady(miniPlayer.element);

		if (!ready) {
			$currentState = 'loading';
		} else {
			$currentState = 'playing';
		}

		miniPlayer.element
			.play()
			.then(() => {
				$currentState = 'playing';
				if (
					miniPlayer &&
					miniPlayer.element &&
					miniPlayer.element.readyState !== 0
				) {
					currentDuration = miniPlayer.element.duration;
					currentProgress = miniPlayer.element.currentTime;
				}
			})
			.catch((e) => {
				console.log('error', e);
			});
	};

	const removePlayer = ({
		context = DEFAULT_PLAYER_CONTEXT,
		id
	}: Parameters<MiniPlayerContext['removePlayer']>[0]) => {
		if (!$nestedMiniPlayers[context]) {
			return;
		}

		const miniPlayer = Array.from($nestedMiniPlayers[context]).find(
			(mp) => mp.id === id
		);

		if (!miniPlayer) {
			return;
		}

		if ($currentMiniPlayer && $currentMiniPlayer.id === id) {
			if ($currentState === 'loading' || $currentState === 'playing') {
				// keep the audio around and clean up later
				$toBeRemoved = { id, context };
				return;
			} else {
				if ($currentMiniPlayer.element) {
					$currentMiniPlayer.element.pause();
				}
				$currentMiniPlayer = undefined;
				$currentContext = DEFAULT_PLAYER_CONTEXT;
				$currentState = 'idle';
			}
		}

		$nestedMiniPlayers[context].delete(miniPlayer);
		$nestedMiniPlayers = $nestedMiniPlayers;
	};

	const miniPlayerContext: MiniPlayerContext = {
		registerPlayer,
		playPlayer,
		removePlayer
	};

	setContext('miniPlayer', miniPlayerContext);

	// ----------------------------------------------------------------
	function stopAll() {
		if ($currentMiniPlayers) {
			$currentMiniPlayers.forEach((miniPlayer) => {
				if (miniPlayer.element) {
					miniPlayer.element.pause();
				}
			});
		}
	}

	function stopOther(miniPlayer: MiniPlayer) {
		if ($currentMiniPlayers) {
			$currentMiniPlayers.forEach((mp) => {
				if (mp !== miniPlayer && mp.element) {
					mp.element.pause();
				}
			});
		}
	}

	function playerReady(p: HTMLAudioElement) {
		console.log(p.readyState);
		if (p.readyState === 4 || p.readyState === 3) {
			return true;
		}
		return false;
	}

	const handlePlay = (e: Event) => {
		// $activePlayer = player;
		if ($currentMiniPlayer && $currentMiniPlayer.element) {
			stopOther($currentMiniPlayer);
		}
		// stopOther(player);
		// if ('mediaSession' in navigator) {
		// 	navigator.mediaSession.playbackState = 'playing';
		// 	updateMetadata(player);
		// 	updatePositionState(player);
		// }
		if ($currentMiniPlayer) {
			// currentMiniPlayer.audio
			// 	.play()
			// 	.then(() => {
			// 		currentState = 'playing';
			// 		if (currentMiniPlayer) {
			// 			currentDuration = currentMiniPlayer.audio.duration;
			// 			currentProgress = currentMiniPlayer.audio.currentTime;
			// 		}
			// 	})
			// 	.catch((e) => {
			// 		console.log('error', e);
			// 	});
		}
	};

	const handlePause = () => {
		// if ('mediaSession' in navigator) {
		// 	navigator.mediaSession.playbackState = 'paused';
		// }
		$currentState = 'paused';
	};

	const handleEnded = () => {
		if ($currentMiniPlayer) {
			handleNext();
		}
	};

	const handleNext = () => {
		if (!$currentMiniPlayer) return;

		const miniPlayersArray = Array.from($currentMiniPlayers);

		const currentIndex = miniPlayersArray.indexOf($currentMiniPlayer);
		const nextIndex =
			currentIndex + 1 > miniPlayersArray.length - 1
				? 0
				: currentIndex + 1;
		const nextMiniPlayer = miniPlayersArray[nextIndex];

		if (nextMiniPlayer && nextMiniPlayer !== $currentMiniPlayer) {
			if (!nextMiniPlayer.element) {
				throw new Error('No element found for next mini player');
			}
			if (nextMiniPlayer.element.readyState !== 0) {
				nextMiniPlayer.element.currentTime = 0;
			}
			const ready = playerReady(nextMiniPlayer.element);
			if (!ready) {
				$currentState = 'loading';
			} else {
				$currentState = 'playing';
			}

			nextMiniPlayer.element.play();
			// updateMetadata(nextMiniPlayer);
			// updatePositionState(nextMiniPlayer);
		}

		$currentId = nextMiniPlayer.id;
	};
	const handlePrev = () => {
		if (!$currentMiniPlayer) return;

		const miniPlayersArray = Array.from($currentMiniPlayers);

		const currentIndex = miniPlayersArray.indexOf($currentMiniPlayer);

		const previousIndex =
			currentIndex - 1 < 0
				? miniPlayersArray.length - 1
				: currentIndex - 1;
		const previousMiniPlayer = miniPlayersArray[previousIndex];
		if (previousMiniPlayer && previousMiniPlayer !== $currentMiniPlayer) {
			if (!previousMiniPlayer.element) {
				throw new Error('No element found for previous mini player');
			}

			if (previousMiniPlayer.element.readyState !== 0) {
				previousMiniPlayer.element.currentTime = 0;
			}

			const ready = playerReady(previousMiniPlayer.element);
			if (!ready) {
				$currentState = 'loading';
			} else {
				$currentState = 'playing';
			}

			previousMiniPlayer.element.play();

			// updateMetadata(previousMiniPlayer);
			// updatePositionState(previousMiniPlayer);
		}

		$currentId = previousMiniPlayer.id;
	};

	// TODO: think about pausible tween

	// const handleStateChange = (state: MediaPlayerState) => {
	// 	if (currentMiniPlayer && currentMiniPlayer.onStateChange) {
	// 		currentMiniPlayer.onStateChange(state);
	// 	}
	// };

	// $: handleStateChange(currentState);

	const requestAction = () => {
		if ($currentMiniPlayer && $currentMiniPlayer.element) {
			if (
				$currentState === 'idle' ||
				$currentState === 'ready' ||
				$currentState === 'paused'
			) {
				const ready = playerReady($currentMiniPlayer.element);

				if (!ready) {
					$currentState = 'loading';
				} else {
					$currentState = 'playing';
				}
				$currentMiniPlayer.element.play();
			} else if ($currentState === 'playing') {
				$currentMiniPlayer.element.pause();
			}
		}
	};

	// $: {
	// 	if (removeCurrentMiniPlayer) {
	// 		if (
	// 			!currentMiniPlayer ||
	// 			currentMiniPlayer.id !== removeCurrentMiniPlayer.id
	// 		) {
	// 			removePlayer({
	// 				id: removeCurrentMiniPlayer.id,
	// 				context: removeCurrentMiniPlayer.context
	// 			});
	// 			removeCurrentMiniPlayer = undefined;
	// 		}
	// 	}
	// }

	const getMiniPlayerIndex = (
		players: Set<MiniPlayer> | undefined,
		player: MiniPlayer | undefined
	) => {
		if (!players || !player) return -1;
		const playersArray = Array.from(players);
		const index = playersArray.indexOf(player);
		if (index === -1) return -1;
		return index + 1;
	};

	const getMiniPlayersSize = (players: Set<MiniPlayer> | undefined) => {
		if (!players) return -1;
		return Array.from(players).length;
	};

	$: index = getMiniPlayerIndex($currentMiniPlayers, $currentMiniPlayer);
	$: size = getMiniPlayersSize($currentMiniPlayers);

	const formatTime = (time: number) => {
		return `${Math.floor(time / 60)
			.toString()
			.padStart(2, '0')}:${Math.floor(time).toString().padStart(2, '0')}`;
	};

	$: $tweenedProgress = currentProgress;

	$: console.log($nestedMiniPlayers);
	$: console.log($currentMiniPlayers);
	$: console.log(Array.from($currentMiniPlayers));
	$: console.log($currentContext);
	$: console.log($currentId);
	$: console.log($currentMiniPlayer);
</script>

<slot />

<div
	tabindex="-1"
	role="region"
	aria-live="polite"
	aria-label="Audio player"
	style="z-index: 9999; position: sticky; bottom: 0"
	class="bg-white/[.85] backdrop-blur-sm"
>
	<!-- {#if $currentMiniPlayers}
		{#each Array.from($currentMiniPlayers) as miniPlayer}
			<audio
				on:play={handlePlay}
				on:pause={handlePause}
				on:ended={handleEnded}
				on:error={(e) => {
					console.log(e);
				}}
				on:timeupdate={() => {
					if (miniPlayer.element) {
						currentProgress = miniPlayer.element.currentTime;
					}
				}}
				bind:this={miniPlayer.element}
				controls
			>
				<source src={miniPlayer.src} type="audio/mpeg" />
				<track kind="captions" />
			</audio>
		{/each}
	{/if} -->
	{#if $currentMiniPlayer}
		<div
			in:slide={{ duration: 400 }}
			out:slide={{ duration: 400 }}
			class="border-t border-mauve-6"
		>
			<!-- <audio
				bind:this={player}
				on:play={handlePlay}
				on:pause={handlePause}
				on:ended={handleEnded}
				on:timeupdate={() => {
					currentProgress = player.currentTime;
				}}
			/> -->
			<Headline
				as="h2"
				type="secondary"
				class="truncate flex justify-between items-center"
			>
				Miniplayer

				<button
					on:click={() => {
						if ($currentMiniPlayer && $currentMiniPlayer.element) {
							$currentMiniPlayer.element.pause();
							$currentMiniPlayer.element.currentTime = 0;

							$currentId = undefined;
							$currentContext = DEFAULT_PLAYER_CONTEXT;
							$currentState = 'idle';
						}
					}}
					class="p-1 m-1 text-xs border rounded-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
				>
					<AccessibleIcon label="Remove player">
						<Close />
					</AccessibleIcon>
				</button>
			</Headline>

			<Music.Row class="flex">
				<Music.Atom>
					<Link href={$currentMiniPlayer.externalUrl} type="ghost">
						{#if $currentMiniPlayer.previewImage}
							<img
								loading="lazy"
								width="60"
								height="60"
								class="h-[68px] w-[68px] object-cover bg-mauve-3"
								src={$currentMiniPlayer.previewImage}
								alt="{$currentMiniPlayer.metaData
									.album} Album Cover"
							/>
						{:else}
							<div class="h-[68px] w-[68px] bg-purple-3" />
						{/if}
					</Link>
				</Music.Atom>
				<Music.Atom class="flex-1 min-w-0 border-l border-mauve-6">
					<div
						class="flex items-center w-full pt-2 pl-2 text-xs space-x-1 text-mauve-11"
					>
						<Artist />
						<p class="truncate text-xs space-x-1 text-mauve-11">
							{$currentMiniPlayer.metaData.artist}
						</p>
					</div>

					<Headline
						as="h3"
						type="tertiary"
						containerClass="pt-0 pr-0 pb-2 border-b-0 md:pb-0"
						class="truncate"
					>
						<Link href={$currentMiniPlayer.externalUrl}>
							{$currentMiniPlayer.metaData.title}
							<span>({index} / {size})</span>
						</Link>
					</Headline>
				</Music.Atom>
			</Music.Row>

			<Progress.Root
				class="w-full h-0.5 bg-mauve-6"
				min={0}
				max={currentDuration}
				value={$tweenedProgress}
				getValueLabel={(value) => `${formatTime(value)}
				/
				${formatTime(currentDuration)}`}
			>
				<Progress.Indicator class="bg-mauve-12 will-change-[width]" />
			</Progress.Root>

			<div
				class="border-b border-mauve-6 p-2 flex justify-between items-center"
			>
				<button
					class="bg-white p-1 pl-2 text-xs border rounded-l-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-w-resize"
					disabled={!$currentMiniPlayer}
					on:click={handlePrev}
				>
					<AccessibleIcon label="Go to previous">
						<West />
					</AccessibleIcon>
				</button>

				<button
					class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-e-resize"
					disabled={!$currentMiniPlayer ||
						$currentState === 'loading'}
					on:click={requestAction}
				>
					{#if $currentState === 'loading'}
						<AccessibleIcon label="Loading">🌀</AccessibleIcon>
					{:else if $currentState === 'playing'}
						<AccessibleIcon label="pause">⏸️</AccessibleIcon>
					{:else}
						<AccessibleIcon label="play">⏯️</AccessibleIcon>
					{/if}
				</button>
				<button
					class="bg-white p-1 pr-2 text-xs border rounded-r-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-e-resize"
					disabled={!$currentMiniPlayer}
					on:click={handleNext}
				>
					<AccessibleIcon label="Go to next">
						<East />
					</AccessibleIcon>
				</button>
			</div>
		</div>
	{/if}
</div>
