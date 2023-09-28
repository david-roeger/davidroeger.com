<script lang="ts">
	import { onMount, setContext, tick } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	import { v4 as uuid } from 'uuid';

	import * as Progress from '$primitives/Progress';

	import { AccessibleIcon } from '$components/AccessibleIcon';
	import * as Music from '$components/Music';
	import { Link } from '$components/Link';

	import East from '$assets/Icons/24/east.svg?component';
	import West from '$assets/Icons/24/west.svg?component';
	import Close from '$assets/Icons/24/close.svg?component';

	import Artist from '$assets/Icons/24/artist.svg?component';
	import Spinner from '$assets/Icons/24/spinner.svg?component';
	import Play from '$assets/Icons/24/play.svg?component';
	import Pause from '$assets/Icons/24/pause.svg?component';

	import { DEFAULT_PLAYER_CONTEXT } from './constants';

	import type {
		MiniPlayerContext,
		MiniPlayer,
		MediaPlayerState
	} from './types';
	import { tweened } from 'svelte/motion';
	import { Headline } from '$components/Headline';
	import { Slide } from '$components/Slide';

	// ----------------------------------------------------------------
	let transitioning = false;
	let direction: 1 | -1 = 1;

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

	const currentMiniPlayer = writable<MiniPlayer | undefined>(undefined);

	const toBeRemoved = writable<{ id: string; context: string } | undefined>(
		undefined
	);

	let currentDuration = 0;
	let currentProgress = 0;
	const tweenedProgress = tweened(currentProgress, {
		duration: 100
	});

	const register = ({
		context = DEFAULT_PLAYER_CONTEXT,
		src,
		metaData,
		externalUrl,
		previewImage
	}: // onStateChange
	Parameters<MiniPlayerContext['register']>[0]) => {
		if (!$nestedMiniPlayers[context]) {
			$nestedMiniPlayers[context] = new Set();
		}

		const id = uuid();

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

	const play = async ({
		context = DEFAULT_PLAYER_CONTEXT,
		id
	}: Parameters<MiniPlayerContext['play']>[0]) => {
		if (!$nestedMiniPlayers[context]) {
			throw new Error(
				`No mini players registered for context ${context}`
			);
		}

		$currentContext = context;

		// await tick so the audio bindings are up to date
		await tick();

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

		const nestedMiniPlayerArray = Array.from($nestedMiniPlayers[context]);
		const miniPlayerIndex = nestedMiniPlayerArray.indexOf(miniPlayer);
		const currentMiniPlayerIndex = $currentMiniPlayer
			? nestedMiniPlayerArray.indexOf($currentMiniPlayer)
			: miniPlayerIndex;

		if (miniPlayerIndex < currentMiniPlayerIndex) {
			direction = -1;
		} else {
			direction = 1;
		}

		$currentMiniPlayer = miniPlayer;

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

	const pause = ({
		context = DEFAULT_PLAYER_CONTEXT,
		id
	}: Parameters<MiniPlayerContext['pause']>[0]) => {
		if (!$nestedMiniPlayers[context]) {
			throw new Error(
				`No mini players registered for context ${context}`
			);
		}

		$currentContext = context;

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

		$currentMiniPlayer = miniPlayer;

		const ready = playerReady(miniPlayer.element);

		if (!ready) {
			$currentState = 'loading';
		} else {
			$currentState = 'playing';
		}

		miniPlayer.element.pause();

		$currentState = 'playing';
	};

	const remove = ({
		context = DEFAULT_PLAYER_CONTEXT,
		id
	}: Parameters<MiniPlayerContext['remove']>[0]) => {
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

	const state = derived(
		[currentContext, currentState, currentMiniPlayer],
		([$currentContext, $currentState, $currentMiniPlayer, ,]) => ({
			context: $currentContext,
			currentId: $currentMiniPlayer && $currentMiniPlayer.id,
			state: $currentState
		})
	);

	const miniPlayerContext: MiniPlayerContext = {
		register,
		play,
		pause,
		remove,
		state
	};

	setContext('miniPlayer', miniPlayerContext);

	const addMediaSessionActionHandler = (
		action: MediaSessionAction,
		handler: MediaSessionActionHandler | null
	) => {
		try {
			navigator.mediaSession.setActionHandler(action, handler);
		} catch (error) {
			console.log(
				`The media session action ${action} is not supported yet.`
			);
		}
	};

	onMount(() => {
		if ('mediaSession' in navigator) {
			addMediaSessionActionHandler('play', async () => {
				if ($currentMiniPlayer && $currentMiniPlayer.element) {
					await $currentMiniPlayer.element.play();
					updateMetadata($currentMiniPlayer);
					updatePositionState($currentMiniPlayer);
				}
			});

			addMediaSessionActionHandler('pause', () => {
				if ($currentMiniPlayer && $currentMiniPlayer.element) {
					$currentMiniPlayer.element.pause();
				}
			});

			addMediaSessionActionHandler('stop', handleClose);

			addMediaSessionActionHandler('nexttrack', handleNext);

			addMediaSessionActionHandler('previoustrack', handlePrev);

			addMediaSessionActionHandler('seekbackward', null);
			addMediaSessionActionHandler('seekforward', null);

			// navigator.mediaSession.setActionHandler('seekto', (details) => {
			// 	if ($currentMiniPlayer && $currentMiniPlayer.element) {
			// 		const to = details.seekTime ?? 0;
			// 		$currentMiniPlayer.element.currentTime = to;
			// 		$currentMiniPlayer.element.play();
			// 	}
			// });
		}
	});

	// ----------------------------------------------------------------
	function stopOtherMiniPlayers(miniPlayer: MiniPlayer) {
		if ($currentMiniPlayers) {
			$currentMiniPlayers.forEach((mp) => {
				if (mp !== miniPlayer && mp.element) {
					mp.element.pause();
				}
			});
		}
	}

	function playerReady(p: HTMLAudioElement) {
		if (p.readyState === 4 || p.readyState === 3) {
			return true;
		}
		return false;
	}

	function updatePositionState(miniPlayer: MiniPlayer) {
		if (
			'mediaSession' in navigator &&
			'setPositionState' in navigator.mediaSession
		) {
			if (miniPlayer.element && playerReady(miniPlayer.element)) {
				navigator.mediaSession.setPositionState({
					duration: miniPlayer.element.duration,
					playbackRate: miniPlayer.element.playbackRate,
					position: miniPlayer.element.currentTime
				});
			}
		}
	}

	function updateMetadata(miniPlayer: MiniPlayer) {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata(
				miniPlayer.metaData
			);
		}
	}

	const handlePlay = (
		e: Event & {
			currentTarget: EventTarget & HTMLAudioElement;
		}
	) => {
		const miniPlayer = Array.from($nestedMiniPlayers[$currentContext]).find(
			(mp) => mp.element === e.currentTarget
		);

		if (!miniPlayer || !miniPlayer.element) {
			return;
		}

		stopOtherMiniPlayers(miniPlayer);

		$currentMiniPlayer = miniPlayer;

		direction = 1;
		miniPlayer.element
			.play()
			.then(() => {
				if ('mediaSession' in navigator) {
					navigator.mediaSession.playbackState = 'playing';
					updateMetadata(miniPlayer);
					updatePositionState(miniPlayer);
				}

				$currentState = 'playing';

				if (miniPlayer.element) {
					currentDuration = miniPlayer.element.duration;
					currentProgress = miniPlayer.element.currentTime;
				}
			})
			.catch((e) => {
				console.log('error', e);
			});
	};

	const handlePause = () => {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.playbackState = 'paused';
		}
		$currentState = 'paused';
	};

	const handleEnded = () => {
		if ($currentMiniPlayer) {
			handleNext();
		}
	};

	const handleNext = () => {
		if (!$currentMiniPlayer) return;
		direction = 1;
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
		}

		$currentMiniPlayer = nextMiniPlayer;
	};

	const handlePrev = () => {
		if (!$currentMiniPlayer) return;
		direction = -1;
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
		}

		$currentMiniPlayer = previousMiniPlayer;
	};

	const handleClose = () => {
		if ($currentMiniPlayer && $currentMiniPlayer.element) {
			$currentMiniPlayer.element.pause();
			$currentMiniPlayer.element.currentTime = 0;
		}

		$currentMiniPlayer = undefined;
		$currentContext = DEFAULT_PLAYER_CONTEXT;
		$currentState = 'idle';
	};

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

	$: {
		if (
			$toBeRemoved &&
			$currentMiniPlayer &&
			$toBeRemoved.id !== $currentMiniPlayer.id
		) {
			remove($toBeRemoved);
			$toBeRemoved = undefined;
		}
	}

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

	const formatTime = (time: number) => {
		return `${Math.floor(time / 60)
			.toString()
			.padStart(2, '0')}:${Math.floor(time).toString().padStart(2, '0')}`;
	};

	$: index = getMiniPlayerIndex($currentMiniPlayers, $currentMiniPlayer);
	$: size = getMiniPlayersSize($currentMiniPlayers);

	$: $tweenedProgress = currentProgress;
</script>

<slot />

<div
	tabindex="-1"
	role="region"
	aria-live="polite"
	aria-label="Audio player"
	style="z-index: 9999; position: sticky;"
	class="bottom-0"
>
	{#if $currentMiniPlayers}
		{#each Array.from($currentMiniPlayers) as miniPlayer (miniPlayer.id)}
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
			>
				<source src={miniPlayer.src} type="audio/mpeg" />
			</audio>
		{/each}
	{/if}
	{#if $currentMiniPlayer}
		<div
			in:slide={{ duration: 400 }}
			out:slide={{ duration: 400 }}
			class="bg-white/[.85] backdrop-blur-sm relative w-full grid grid-cols-[minmax(0,1fr),auto] gap-4 select-none"
		>
			<Progress.Root
				class="w-full h-0.5 bg-mauve-6 absolute top-0"
				min={0}
				max={currentDuration}
				value={$tweenedProgress}
				getValueLabel={(value) => `${formatTime(value)}
		/
		${formatTime(currentDuration)}`}
			>
				<Progress.Indicator class="bg-mauve-12 will-change-[width]" />
			</Progress.Root>
			<Slide
				key={$currentMiniPlayer.id}
				{direction}
				on:introstart={() => {
					transitioning = true;
				}}
				on:introend={() => {
					transitioning = false;
				}}
			>
				<Music.Row as="div" class="flex border-b-0 flex-shrink w-full">
					<Music.Atom>
						<Link
							href={$currentMiniPlayer.externalUrl}
							type="ghost"
						>
							{#if $currentMiniPlayer.previewImage}
								<img
									loading="lazy"
									width="60"
									height="60"
									class="h-[64px] w-[64px] object-cover bg-mauve-3"
									src={$currentMiniPlayer.previewImage}
									alt="{$currentMiniPlayer.metaData
										.album} Album Cover"
								/>
							{:else}
								<div class="h-[64px] w-[64px] bg-purple-3" />
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
							type="quaternary"
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
			</Slide>
			<div
				class="p-2 flex space-x-2 md:space-x-4 items-center border-l border-mauve-6"
			>
				<div class="flex space-x-2 items-center">
					<button
						class="hidden sm:block bg-white p-1 pl-2 text-xs border rounded-l-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-w-resize"
						disabled={!$currentMiniPlayer || transitioning}
						on:click={handlePrev}
					>
						<AccessibleIcon label="Go to previous">
							<West />
						</AccessibleIcon>
					</button>

					<button
						class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-e-resize"
						disabled={!$currentMiniPlayer ||
							$currentState === 'loading' ||
							transitioning}
						on:click={requestAction}
					>
						{#if $currentState === 'loading'}
							<AccessibleIcon label="loading">
								<Spinner class="animate-loading-1" />
							</AccessibleIcon>
						{:else if $currentState === 'playing'}
							<AccessibleIcon label="pause">
								<Pause />
							</AccessibleIcon>
						{:else}
							<AccessibleIcon label="play">
								<Play />
							</AccessibleIcon>
						{/if}
					</button>
					<button
						class="hidden sm:block bg-white p-1 pr-2 text-xs border rounded-r-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-e-resize"
						disabled={!$currentMiniPlayer || transitioning}
						on:click={handleNext}
					>
						<AccessibleIcon label="Go to next">
							<East />
						</AccessibleIcon>
					</button>
				</div>
				<button
					class=" bg-white p-1 text-xs border rounded-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-w-resize"
					on:click={() => {
						if ($currentMiniPlayer) {
							if ($currentMiniPlayer.element) {
								$currentMiniPlayer.element.pause();
								$currentMiniPlayer.element.currentTime = 0;
							}
							$currentMiniPlayer = undefined;
							$currentContext = DEFAULT_PLAYER_CONTEXT;
							$currentState = 'idle';
						}
					}}
				>
					<AccessibleIcon label="close">
						<Close />
					</AccessibleIcon>
				</button>
			</div>
		</div>
	{/if}
</div>
