<script lang="ts">
	import { current, produce } from 'immer';

	import { Button } from '$components/Button';
	import * as Slider from '$primitives/Slider';

	import { createFramer } from '$utils/Store/framer';
	import { createStack } from '$utils/Store/stack';
	import { onDestroy } from 'svelte';
	import { derived } from 'svelte/store';
	import { calculateAliveNeighborsCount, wrapX, wrapY } from './utils';
	import EditDreamForm from '$slices/EditDreamForm/EditDreamForm.svelte';

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

	const COL_COUNT = 40;
	const ROW_COUNT = 20;

	const GRID = initializeGrid(ROW_COUNT, COL_COUNT);

	const framer = createFramer(DEFAULT_FRAME_RATE, false);
	const frame = derived(framer, (framerValue) => framerValue.frame);

	const stack = createStack({ frame: 0, state: GRID, source: 'initial' });

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
		if (frame === 0) return;

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
			frame,
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
				draftState[y][x] = draftState[y][x] === 1 ? 0 : 1;
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

	let pointerId: number | undefined;
	const slideStart = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		pointerId = e.pointerId;

		if (target.dataset.x && target.dataset.y && mode === 'draw') {
			selection.add(`${target.dataset.x}-${target.dataset.y}`);
			selection = selection;
			console.log('selection', `${target.dataset.x}-${target.dataset.y}`);
		}
		e.preventDefault();
	};

	const slideMove = (e: PointerEvent) => {
		if (mode === 'glider') return;

		const target = e.target as HTMLElement;
		console.log('move', `${target.dataset.x}-${target.dataset.y}`);
		if (pointerId === e.pointerId) {
			if (target.dataset.x && target.dataset.y && mode === 'draw') {
				selection.add(`${target.dataset.x}-${target.dataset.y}`);
				selection = selection;
			}

			e.preventDefault();
		}
	};

	const slideStop = (e: PointerEvent) => {
		console.log('stop');

		if (e.pointerId === pointerId) {
			const target = e.target as HTMLElement;

			if (target.dataset.x && target.dataset.y) {
				if (mode === 'draw') {
					selection.add(`${target.dataset.x}-${target.dataset.y}`);
					selection = selection;
					applySelection(selection);
					selection.clear();
					selection = selection;
				} else {
					const xPos = parseInt(target.dataset.x);
					const yPos = parseInt(target.dataset.y);

					placeGlider(xPos, yPos);
				}
			}

			console.log('selection', selection);

			pointerId = undefined;
		}
	};

	const slideCancel = (e: PointerEvent) => {
		if (mode === 'glider') return;

		if (e.pointerId === pointerId) {
			selection.clear();
			selection = selection;
			pointerId = undefined;
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
				stack.redo();
			}
			e.preventDefault();
		} else if (e.key === prevKey) {
			if ($framer.playing) {
				framer.pause();
			}
			if (!$stack.first) {
				stack.undo();
				e.preventDefault();
			}
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

	$: console.log(selection);
</script>

<svelte:window on:keydown={handleKeyDown} />
<p>{$frame}</p>
<p>1 / {$framer.frameRate}</p>
<p>{1 / $framer.frameRate}</p>
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

<Slider.Root
	on:valueChange={(e) => framer.setFrameRate(e.detail.values[0])}
	class="flex items-center w-full py-4 md:w-96"
	min={1}
	max={240}
	step={1}
	label="frameRate"
>
	<Slider.Track class="h-2 bg-white border rounded-full border-mauve-12">
		<Slider.Range class="h-full rounded-full bg-blue-6" />
	</Slider.Track>
	<Slider.Thumb
		defaultValue={DEFAULT_FRAME_RATE}
		class="w-6 h-6 bg-white border rounded-full border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 touch-none"
	/>
</Slider.Root>

<p>total {$stack.current.state.flat().length}</p>
<p>alive {$stack.current.state.flat().reduce((acc, curr) => acc + curr, 0)}</p>
<p>
	dead {$stack.current.state
		.flat()
		.reduce((acc, curr) => acc + (curr === 0 ? 1 : 0), 0)}
</p>

<p>stack {$stack.current.frame}</p>
<div
	style="--row-count: {ROW_COUNT}; --col-count: {COL_COUNT}"
	class="gol-grid"
	on:pointerdown={(e) => slideStart(e)}
	on:pointermove={(e) => slideMove(e)}
	on:pointerup={(e) => slideStop(e)}
	on:pointercancel={(e) => slideCancel(e)}
>
	{#each $stack.current.state as row, y (y)}
		{#each row as cell, x (x)}
			<!--Popper.Root class="contents" defaultOpen={false}>
				<Popper.Trigger
					class="w-8 h-8 bg-blue-3 border border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1 grid-cols-2"
				>
					{cell}
				</Popper.Trigger>
				<Popper.Content
					class="bg-white border border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1 px-4 py-2"
					side="top"
					align="center"
					avoidCollisions={false}
				>
					<p>({x} | {y}) {cell}</p>
				</Popper.Content>
				on:click={() => {
					placeGlider(x, y);
				}}
			</Popper.Root-->
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
				class="w-8 h-8 bg-blue-3 border border-mauve-6 data-[state=alive]:bg-blue-6 {hoveredSelection.has(
					`${x}-${y}`
				) || selection.has(`${x}-${y}`)
					? '!bg-orange-6'
					: ''}"
				data-state={!!cell ? 'alive' : 'dead'}
				data-x={x}
				data-y={y}
			/>
		{/each}
	{/each}
</div>

<style>
	.gol-grid {
		display: grid;
		margin-left: auto;
		margin-right: auto;

		grid-template-columns: repeat(var(--col-count), minmax(0, 32px));
		grid-template-rows: repeat(var(--row-count), minmax(0, 32px));

		justify-content: center;
		border: 1px solid hsl(var(--drds-mauve-6));
	}
</style>
