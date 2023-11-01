<script lang="ts">
	import { produce } from 'immer';

	import { Button } from '$components/Button';
	import * as Slider from '$primitives/Slider';

	import { createFramer } from '$utils/Store/framer';
	import { createStack } from '$utils/Store/stack';
	import { onDestroy } from 'svelte';
	import { derived } from 'svelte/store';
	import { calculateAliveNeighborsCount, wrapX, wrapY } from './utils';

	import * as Switch from '$primitives/Switch';
	import Thumb from '$primitives/Slider/Thumb.svelte';

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

	const GLIDER_NORTH = [
		[0, 1, 0],
		[0, 0, 1],
		[1, 1, 1]
	];

	const GLIDER_EAST = [
		[1, 0, 0],
		[1, 0, 1],
		[1, 1, 0]
	];

	const GLIDER_SOUTH = [
		[0, 1, 1],
		[1, 0, 1],
		[0, 0, 1]
	];

	const GLIDER_WEST = [
		[0, 1, 1],
		[1, 0, 1],
		[1, 0, 0]
	];

	let rotation = 0;
	const GLIDERS = [
		GLIDER_NORTH,
		GLIDER_EAST,
		GLIDER_SOUTH,
		GLIDER_WEST
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
			console.log('pausing');
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
			console.log('selection', `${target.dataset.x}-${target.dataset.y}`);
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
		console.log('stop');

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

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === nextKey) {
			if ($framer.playing) {
				framer.pause();
			}
			if ($stack.last) {
				framer.pushFrame(true);
			} else {
				const jumpToEnd = e.shiftKey;
				stack.redo(jumpToEnd);
			}
			e.preventDefault();
		} else if (e.key === prevKey) {
			if ($framer.playing) {
				framer.pause();
			}
			if (!$stack.first) {
				const jumpToStart = e.shiftKey;
				stack.undo(jumpToStart);
			}
			e.preventDefault();
		} else if (e.key === 'r') {
			rotation = (rotation + 1) % GLIDERS.length;
		} else if (e.key === 'c') {
			stack.update((current) => ({
				...current,
				state: clearGrid(ROW_COUNT, COL_COUNT),
				source: 'clear'
			}));
		}
	};
</script>

<svelte:window on:keydown={handleKeyDown} />

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

<div
	class="bg-white/[.85] flex flex-col items-center justify-center pt-2 border-t border-b md:pt-0 md:flex-row border-mauve-6"
>
	<div class="w-full px-8 md:w-fit-content">
		<Slider.Root
			on:valueChange={(e) => framer.setFrameRate(e.detail.values[0])}
			class="flex items-center w-full py-4 md:w-96"
			min={1}
			max={240}
			step={1}
			label="Framerate"
		>
			<Slider.Track
				class="h-2 bg-white border rounded-full border-mauve-12"
			>
				<Slider.Range class="h-full rounded-full bg-blue-6" />
			</Slider.Track>
			<Slider.Thumb
				defaultValue={DEFAULT_FRAME_RATE}
				class="w-6 h-6 bg-white border rounded-full border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 touch-none"
			/>
		</Slider.Root>
	</div>
</div>

<p>{$stack.current.frame}</p>
<p>{$framer.frameRate} fps</p>
<p>{1 / $framer.frameRate}</p>
<p>{mode}</p>
<p>playing: {$framer.playing ? 'true' : 'false'}</p>

<Button disabled={$framer.playing} on:click={() => framer.play()}>Play</Button>
<Button disabled={!$framer.playing} on:click={() => framer.pause()}>
	Pause
</Button>
<Button
	on:click={() =>
		stack.update((current) => ({
			...current,
			state: initializeGrid(ROW_COUNT, COL_COUNT),
			source: 'push'
		}))}
>
	randomize
</Button>
<Button on:click={() => framer.pushFrame(true)}>Push Frame</Button>

<form>
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
		class="border border-mauve-12 bg-mauve-6 w-12 data-[state=checked]:bg-blue-6 rounded-full m-8 relative focus:"
	>
		<Switch.Thumb
			class="w-6 h-6 bg-white ring-1 ring-mauve-12 rounded-full ml-0 data-[state=checked]:translate-x-full transition-transform"
		/>
	</Switch.Root>
	<label for="switch">Glider</label>
</form>
<Button
	data-state={mode === 'draw' ? 'active' : 'inactive'}
	on:click={() => (mode = 'draw')}
>
	Draw
</Button>
<Button
	data-state={mode === 'glider' ? 'active' : 'inactive'}
	on:click={() => (mode = 'glider')}
>
	Glider
</Button>
<Button disabled={$stack.first} on:click={() => stack.undo()}>Undo</Button>
<Button disabled={$stack.last} on:click={() => stack.redo()}>Redo</Button>

<Button
	on:click={() =>
		stack.update((current) => ({
			...current,
			state: clearGrid(ROW_COUNT, COL_COUNT),
			source: 'clear'
		}))}
>
	clear
</Button>

<p>total {$stack.current.state.flat().length}</p>
<p>alive {$stack.current.state.flat().reduce((acc, curr) => acc + curr, 0)}</p>
<p>
	dead {$stack.current.state
		.flat()
		.reduce((acc, curr) => acc + (curr === 0 ? 1 : 0), 0)}
</p>

<p>stack {$stack.current.frame}</p>
<p>{$stack.index}</p>
