<script lang="ts">
	import { produce } from 'immer';

	import { Button } from '$components/Button';
	import { AccessibleIcon } from '$components/AccessibleIcon';

	import * as Slider from '$primitives/Slider';

	import { createFramer } from '$utils/Store/framer';
	import { createStack } from '$utils/Store/stack';
	import { onDestroy, tick } from 'svelte';
	import { derived } from 'svelte/store';
	import { calculateAliveNeighborsCount, wrapX, wrapY } from './utils';

	import * as Switch from '$primitives/Switch';

	import Randomize from '$assets/Icons/24/randomize.svg?component';
	import Close from '$assets/Icons/24/close.svg?component';
	import Filter from '$assets/Icons/24/filter.svg?component';
	import Play from '$assets/Icons/24/play.svg?component';
	import Pause from '$assets/Icons/24/pause.svg?component';
	import West from '$assets/Icons/24/west.svg?component';
	import East from '$assets/Icons/24/east.svg?component';
	import Headline from '$components/Headline/Headline.svelte';

	const DEFAULT_FRAME_RATE = 24;

	const initializeGrid = (rowCount: number, colCount: number) => {
		const grid = [];
		for (let y = 0; y < rowCount; y++) {
			const row = [];
			for (let x = 0; x < colCount; x++) {
				row.push(Math.round(Math.random()));
			}
			grid.push(row);
		}
		return grid;
	};

	const clearGrid = (rowCount: number, colCount: number) => {
		const grid = [];
		for (let y = 0; y < rowCount; y++) {
			const row = [];
			for (let x = 0; x < colCount; x++) {
				row.push(0);
			}
			grid.push(row);
		}
		return grid;
	};

	let containerWidth = 0;
	let containerHeight = 0;

	const CELL_SIZE = 32;
	$: COL_COUNT = Math.floor(containerWidth / CELL_SIZE);
	$: ROW_COUNT = Math.floor(containerHeight / CELL_SIZE);

	// whenever the container size changes, we want to reset the grid
	$: stack = createStack({
		frame: 1,
		state: initializeGrid(ROW_COUNT, COL_COUNT),
		source: 'initial'
	});

	const framer = createFramer(DEFAULT_FRAME_RATE, false);
	const frame = derived(framer, (framerValue) => framerValue.frame);

	const GLIDER_EAST_SOUTH = [
		[0, 1, 0],
		[0, 0, 1],
		[1, 1, 1]
	];

	const GLIDER_SOUTH_WEST = [
		[1, 0, 0],
		[1, 0, 1],
		[1, 1, 0]
	];

	const GLIDER_WEST_NORTH = [
		[1, 1, 1],
		[1, 0, 0],
		[0, 1, 0]
	];

	const GLIDER_NORTH_EAST = [
		[0, 1, 1],
		[1, 0, 1],
		[0, 0, 1]
	];

	let rotation = 0;
	const GLIDERS = [
		GLIDER_EAST_SOUTH,
		GLIDER_SOUTH_WEST,
		GLIDER_WEST_NORTH,
		GLIDER_NORTH_EAST
	] as const;

	const onFrameUpdate = async (frame: number) => {
		if (frame === 1) return;

		const current = $stack.current;
		const currentState = current.state;
		const nextState = produce(currentState, (draftState) => {
			for (let y = 0; y < draftState.length; y++) {
				const row = draftState[y];
				for (let x = 0; x < row.length; x++) {
					const aliveNeighborsCount = calculateAliveNeighborsCount(
						x,
						y,
						currentState,
						COL_COUNT,
						ROW_COUNT
					);

					const cell = currentState[y][x];

					// 1. if cell is dead and has 3 neighbors, it becomes alive
					if (cell === 0 && aliveNeighborsCount === 3) {
						draftState[y][x] = 1;
						continue;
					}

					// 2. if cell is alive and has less than 2 neighbors, it dies
					if (cell === 1 && aliveNeighborsCount < 2) {
						draftState[y][x] = 0;
						continue;
					}

					// 3. if cell is alive and has 2 or 3 neighbors, it lives
					if (
						(cell === 1 && aliveNeighborsCount === 2) ||
						aliveNeighborsCount === 3
					) {
						draftState[y][x] = 1;
						continue;
					}

					// 4. if cell is alive and has more than 3 neighbors, it dies
					if (cell === 1 && aliveNeighborsCount > 3) {
						draftState[y][x] = 0;
						continue;
					}
				}
			}
		});

		// @TODO: there might be a race condition here
		// if the user pushes a frame while the update function is running

		if (currentState === nextState) {
			framer.pause();
		}

		stack.push({
			frame: current.frame + 1,
			state: nextState,
			source: 'frame'
		});
	};

	$: onFrameUpdate($frame);

	onDestroy(() => {
		framer.unsubscribe();
	});

	const applySelection = (selection: Set<`${string}-${string}`>) => {
		const nextState = produce($stack.current.state, (draftState) => {
			selection.forEach((key) => {
				const [x, y] = key.split('-').map((n) => parseInt(n));
				draftState[y][x] = 1;
			});
		});

		stack.update((current) => {
			return {
				...current,
				state: nextState,
				source: 'push'
			};
		});
	};

	const placeGlider = (xPos: number, yPos: number) => {
		const GLIDER = GLIDERS[rotation];
		const nextState = produce($stack.current.state, (draftState) => {
			for (let y = 0; y < GLIDER.length; y++) {
				const row = GLIDER[y];
				for (let x = 0; x < row.length; x++) {
					if (GLIDER[y][x] === 1) {
						draftState[wrapY(yPos + y - 1, ROW_COUNT)][
							wrapX(xPos + x - 1, COL_COUNT)
						] = GLIDER[y][x];
					}
				}
			}
		});

		stack.update((current) => {
			return {
				...current,
				state: nextState,
				source: 'push'
			};
		});
	};

	let mode: 'draw' | 'glider' = 'draw';
	let selection = new Set<`${string}-${string}`>();
	let hovered: `${string}-${string}` | undefined;

	const generateHoveredSelection = (
		hovered: `${string}-${string}` | undefined,
		rotation: number
	) => {
		if (!hovered) return new Set<`${string}-${string}`>();
		const [xPos, yPos] = hovered.split('-').map((n) => parseInt(n));
		if (mode === 'draw') {
			return new Set<`${string}-${string}`>([hovered]);
		}

		const hoveredSelection = new Set<`${string}-${string}`>();
		const GLIDER = GLIDERS[rotation];
		for (let y = 0; y < GLIDER.length; y++) {
			const row = GLIDER[y];
			for (let x = 0; x < row.length; x++) {
				if (GLIDER[y][x] === 1) {
					hoveredSelection.add(
						`${wrapX(xPos + x - 1, COL_COUNT)}-${wrapY(
							yPos + y - 1,
							ROW_COUNT
						)}`
					);
				}
			}
		}
		return hoveredSelection;
	};

	$: hoveredSelection = generateHoveredSelection(hovered, rotation);

	const slideStart = (e: PointerEvent) => {
		const target = e.target as HTMLElement | null;
		if (!target) return;
		target.setPointerCapture(e.pointerId);

		if (target.dataset.x && target.dataset.y && mode === 'draw') {
			selection.add(`${target.dataset.x}-${target.dataset.y}`);
			selection = selection;
		}

		e.preventDefault();
	};

	const slideMove = (e: PointerEvent) => {
		if (mode === 'glider') return;

		const target = e.target as HTMLElement | null;

		if (target && target.hasPointerCapture(e.pointerId)) {
			const cell = document.elementFromPoint(
				e.clientX,
				e.clientY
			) as HTMLElement | null;

			if (cell && cell.dataset.x && cell.dataset.y && mode === 'draw') {
				selection.add(`${cell.dataset.x}-${cell.dataset.y}`);
				selection = selection;
			}

			e.preventDefault();
		}
	};

	const slideStop = (e: PointerEvent) => {
		const target = e.target as HTMLElement | null;
		if (target && target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);

			const cell = document.elementFromPoint(
				e.clientX,
				e.clientY
			) as HTMLElement | null;

			if (cell && cell.dataset.x && cell.dataset.y) {
				if (mode === 'draw') {
					selection.add(`${cell.dataset.x}-${cell.dataset.y}`);
					applySelection(selection);
					selection.clear();
					selection = selection;
				} else {
					const xPos = parseInt(cell.dataset.x);
					const yPos = parseInt(cell.dataset.y);

					placeGlider(xPos, yPos);
				}
			}
		}
	};

	const slideCancel = (e: PointerEvent) => {
		if (mode === 'glider') return;

		const target = e.target as HTMLElement | null;
		if (target && target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);

			selection.clear();
			selection = selection;

			e.preventDefault();
		}
	};

	const nextKey = 'ArrowRight';
	const prevKey = 'ArrowLeft';
	const enterKey = 'Enter';
	const spaceKey = ' ';

	const handleNext = (jumpToEnd = false) => {
		if ($framer.playing) {
			framer.pause();
		}
		if ($stack.last) {
			framer.pushFrame(true);
		} else {
			stack.redo(jumpToEnd);
		}
	};

	const handlePrev = (jumpToStart = false) => {
		if ($framer.playing) {
			framer.pause();
		}
		stack.undo(jumpToStart);
	};

	const togglePlay = () => {
		if ($framer.playing) {
			framer.pause();
		} else {
			framer.play();
		}
	};

	const handleClear = () => {
		if ($framer.playing) {
			framer.pause();
		}
		stack.update((current) => ({
			...current,
			state: clearGrid(ROW_COUNT, COL_COUNT),
			source: 'clear'
		}));
	};

	const handleRotate = () => {
		rotation = (rotation + 1) % GLIDERS.length;
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === nextKey) {
			handleNext(e.shiftKey);
			e.preventDefault();
		} else if (e.key === prevKey) {
			if (!$stack.first) {
				handlePrev(e.shiftKey);
				e.preventDefault();
			}
		} else if (e.key === spaceKey) {
			if (
				document.activeElement === document.body ||
				document.activeElement === playButton ||
				document.activeElement === pauseButton
			) {
				togglePlay();
				e.preventDefault();
			}
		} else if (e.key === 'r') {
			if (mode === 'glider') {
				handleRotate();
				e.preventDefault();
			}
		} else if (e.key === 'c') {
			handleClear();
			e.preventDefault();
		}
	};

	let playButton: HTMLButtonElement;
	let pauseButton: HTMLButtonElement;

	$: console.log('rotation', rotation);
</script>

<svelte:window on:keydown={handleKeyDown} />

<Headline containerClass="py-8 md:py-16">
	<span aria-hidden="true" class="select-none">::</span>
	Game of life
</Headline>

<div
	bind:clientWidth={containerWidth}
	bind:clientHeight={containerHeight}
	style="--row-count: {ROW_COUNT}; --col-count: {COL_COUNT}; --cell-size: {CELL_SIZE}px;"
	class="relative border-b border-mauve-6 w-full portrait:aspect-w-1 portrait:aspect-h-1 landscape:aspect-w-[2.35] landscape:aspect-h-1 landscape:md:aspect-w-16 landscape:md:aspect-h-[8.5] bg-blue-3"
>
	<div>
		<div
			class="bg-mauve-1 grid relative ring-1 ring-mauve-6 mx-auto grid-cols-[repeat(var(--col-count),var(--cell-size))] grid-rows-[repeat(var(--row-count),var(--cell-size))] w-[calc(var(--col-count)*var(--cell-size))] h-[calc(var(--row-count)*var(--cell-size))]"
			on:pointerdown={slideStart}
			on:pointermove={slideMove}
			on:pointerup={slideStop}
			on:pointercancel={slideCancel}
		>
			{#each $stack.current.state as row, y (y)}
				{#each row as cell, x (x)}
					<div
						on:mouseenter={() => {
							hovered = `${x}-${y}`;
						}}
						on:mouseout={() => {
							if (hovered === `${x}-${y}`) {
								hovered = undefined;
							}
						}}
						on:click={() => {
							if (mode === 'glider') {
								placeGlider(x, y);
							}
						}}
						class="relative touch-none
							data-[checker=even]:bg-mauve-3
							data-[state=alive]:before:bg-blue-6 before:w-full before:h-full before:absolute
							data-[hovered=true]:after:bg-orange-6 data-[selected=true]:after:bg-orange-6 after:w-full after:h-full after:absolute"
						data-state={!!cell ? 'alive' : 'dead'}
						data-hovered={hoveredSelection.has(`${x}-${y}`)}
						data-selected={selection.has(`${x}-${y}`)}
						data-checker={y % 2 === 0
							? x % 2 === 0
								? 'even'
								: 'odd'
							: x % 2 === 0
							? 'odd'
							: 'even'}
						data-x={x}
						data-y={y}
					/>
				{/each}
			{/each}
		</div>
	</div>
</div>

<div class="border-b border-mauve-6">
	<div class="py-8 px-2 md:w-3/4 md:border-r border-mauve-6">
		<div
			class="p-2 border border-mauve-6 bg-white/[.85] rounded-full flex gap-4 flex-grow-0 justify-center"
		>
			<Button
				variant="custom"
				form="custom"
				class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-pointer rounded-full"
				disabled={$stack.first}
				on:click={() => {
					handlePrev();
				}}
			>
				<span class="text-mauve-11">
					<AccessibleIcon label="last Frame">
						<West />
					</AccessibleIcon>
				</span>
			</Button>

			<Button
				variant="custom"
				form="custom"
				class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-pointer rounded-full"
				disabled={$framer.playing}
				on:click={() => {
					framer.play();
				}}
			>
				<AccessibleIcon label="play">
					<Play />
				</AccessibleIcon>
			</Button>

			<Button
				variant="custom"
				form="custom"
				class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-pointer rounded-full"
				disabled={!$framer.playing}
				on:click={() => {
					framer.pause();
				}}
			>
				<AccessibleIcon label="pause">
					<Pause />
				</AccessibleIcon>
			</Button>

			<Button
				variant="custom"
				form="custom"
				class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-pointer rounded-full"
				style="transform: rotate({rotation * 90 + 180}deg)"
				disabled={mode === 'draw'}
				on:click={() => {
					handleRotate();
				}}
			>
				<AccessibleIcon label="rotate glider">
					<Filter />
				</AccessibleIcon>
			</Button>

			<Button
				variant="custom"
				form="custom"
				class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-pointer rounded-full"
				on:click={() => {
					handleNext();
				}}
			>
				<span class="text-mauve-11">
					<AccessibleIcon label="next Frame">
						<East />
					</AccessibleIcon>
				</span>
			</Button>
		</div>
	</div>
</div>

<div class="border-b border-mauve-6">
	<div class="md:w-3/4 md:border-r border-mauve-6 flex">
		<div
			class="flex-1 sm:flex-grow-[2] border-r border-mauve-6 py-8 px-2 md:p-8 xl:p-16 bg-white/[.85] flex flex-col justify-center"
		>
			<p>Frame {$stack.current.frame}</p>
			<p class="mt-4">Cells total {$stack.current.state.flat().length}</p>
			<p>
				Cells alive {$stack.current.state
					.flat()
					.reduce((acc, curr) => acc + curr, 0)}
			</p>
			<p>
				Cells dead {$stack.current.state
					.flat()
					.reduce((acc, curr) => acc + (curr === 0 ? 1 : 0), 0)}
			</p>

			<p class="mt-4">Framerate {$framer.frameRate} fps</p>
		</div>

		<div class="flex-1 flex items-center justify-center">
			<form
				class="flex items-center py-8 px-2 md:p-8 xl:p-16 gap-4 flex-col"
			>
				<label for="switch" class:font-bold={mode === 'draw'}>
					Draw
				</label>
				<Switch.Root
					name="switch"
					id="switch"
					on:checkedChange={(e) => {
						if (e.detail.value) {
							mode = 'glider';
						} else {
							mode = 'draw';
						}
					}}
					class="flex border border-mauve-12 bg-mauve-6 h-12 data-[state=checked]:bg-blue-6 rounded-full focus:ring-mauve-12 focus:ring-1"
				>
					<Switch.Thumb
						class="w-6 h-6 bg-white border border-mauve-12 -m-px rounded-full data-[state=checked]:translate-y-6 transition-transform"
					/>
				</Switch.Root>
				<label for="switch" class:font-bold={mode === 'glider'}>
					Glider
				</label>
			</form>
		</div>
	</div>
</div>

<div
	class="bg-white/[.85] border-y border-mauve-6 flex flex-col sm:flex-row gap-2 w-full px-8 py-4 justify-center items-center"
>
	<Slider.Root
		on:valueChange={(e) => framer.setFrameRate(e.detail.values[0])}
		class="flex items-center w-full py-4 max-w-[384px]"
		min={1}
		max={240}
		step={1}
		label="Framerate"
	>
		<Slider.Track class="h-2 bg-white border rounded-full border-mauve-12">
			<Slider.Range class="h-full rounded-full bg-blue-6" />
		</Slider.Track>
		<Slider.Thumb
			defaultValue={DEFAULT_FRAME_RATE}
			class="w-6 h-6 bg-white border rounded-full border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 touch-none"
		/>
	</Slider.Root>
	<div class="flex gap-2 items-center">
		<Button
			variant="custom"
			form="custom"
			class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-pointer rounded-full"
			on:click={() => {
				stack.update((current) => ({
					...current,
					state: initializeGrid(ROW_COUNT, COL_COUNT),
					source: 'push'
				}));
			}}
		>
			<AccessibleIcon label="randomize">
				<Randomize />
			</AccessibleIcon>
		</Button>
		<Button
			variant="custom"
			form="custom"
			class="bg-white p-1 text-xs border touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 cursor-pointer rounded-full"
			on:click={() => {
				handleClear();
			}}
		>
			<AccessibleIcon label="clear grid">
				<Close />
			</AccessibleIcon>
		</Button>
	</div>
</div>
