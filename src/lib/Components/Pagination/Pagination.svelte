<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query';

	import * as VisuallyHidden from '$primitives/VisuallyHidden';

	import {AccessibleIcon} from '$components/AccessibleIcon';

	import East from '$assets/Icons/24/east.svg?component';
	import West from '$assets/Icons/24/west.svg?component';

	import { preload } from '$actions/preload';
	
	import type { Pageable } from './types';

	export let currentPage: number;
	export let pagable: Pageable<unknown>;
	export let isLoading: boolean;
	export let boundaryCount = 1;
	export let siblingCount = 1;

	export let getHref: (page: number) => string;

	export let onItemClick: (page: number) => void;
	export let onItemPreload: (page: number) => void;

	const range = (start: number, end: number) => {
		const length = end - start + 1;
		return Array.from({ length }, (_, i) => start + i);
	};

	const getInRange = (
		current: number,
		last: number,
		boundaryCount: number,
		siblingCount: number
	) => {
		const startPages = range(1, Math.min(boundaryCount, last));
		const endPages = range(
			Math.max(last - boundaryCount + 1, boundaryCount + 1),
			last
		);

		const siblingsStart = Math.max(
			Math.min(
				// Natural start
				current - siblingCount,
				// Lower boundary when page is high
				last - boundaryCount - siblingCount * 2 - 1
			),
			// Greater than startPages
			boundaryCount + 2
		);

		const siblingsEnd = Math.min(
			Math.max(
				// Natural end
				current + siblingCount,
				// Upper boundary when page is low
				boundaryCount + siblingCount * 2 + 2
			),
			// Less than endPages
			endPages.length > 0 ? endPages[0] - 2 : last - 1
		);

		// Basic list of items to render
		// e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
		const itemList = [
			...startPages,

			// Start ellipsis
			// eslint-disable-next-line no-nested-ternary
			...(siblingsStart > boundaryCount + 2
				? [-1]
				: boundaryCount + 1 < last - boundaryCount
				? [boundaryCount + 1]
				: []),

			// Sibling pages
			...range(siblingsStart, siblingsEnd),

			// End ellipsis
			// eslint-disable-next-line no-nested-ternary
			...(siblingsEnd < last - boundaryCount - 1
				? [-2]
				: last - boundaryCount > boundaryCount
				? [last - boundaryCount]
				: []),

			...endPages
		];

		return itemList;
	};

	$: IN_RANGE = getInRange(
		currentPage,
		pagable.last,
		boundaryCount,
		siblingCount
	);
</script>

<div class="flex p-2 gap-2 border-mauve-6 flex-wrap">
	<button
		on:click={() => {
			if (pagable && pagable.hasPrevious) {
				onItemClick(pagable.previous);
			}
		}}
		use:preload
		on:preload={() => {
			if (pagable && pagable.hasPrevious) {
				onItemPreload(pagable.previous);
			}
		}}
		disabled={!pagable || !pagable.hasPrevious || isLoading}
		class="p-2 bg-white border rounded-full border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 disabled:cursor-not-allowed disabled:bg-white disabled:border-mauve-11 disabled:ring-mauve-11 disabled:text-mauve-11"
	>
		<AccessibleIcon label="Go to previous">
			<West />
		</AccessibleIcon>
	</button>

	{#each IN_RANGE as i (i)}
		{#if i >= 0}
			<button
				on:click={() => {
					onItemClick(i);
				}}
				use:preload
				on:preload={() => {
					onItemPreload(i);
				}}
				class="text-center px-4 py-2 flex-1 border border-mauve-12 focus:outline-none ring-mauve-12
	focus:ring-1 bg-white aria-current-page:bg-purple-5 disabled:cursor-not-allowed disabled:bg-white disabled:border-mauve-11 disabled:ring-mauve-11 disabled:text-mauve-11"
				aria-current={currentPage === i ? 'page' : undefined}
				aria-label={currentPage === i ? `Page ${i}` : undefined}
			>
				{#if currentPage !== i}
					<VisuallyHidden.Root>Page</VisuallyHidden.Root>
				{/if}
				{i}
			</button>
		{:else}
			<span
				class="px-4 py-2 flex-1 text-center border border-transparent text-mauve-11"
			>
				...
			</span>
		{/if}
	{/each}

	<button
		on:click={() => {
			if (pagable && pagable.hasNext) {
				onItemClick(pagable.next);
			}
		}}
		use:preload
		on:preload={() => {
			if (pagable && pagable.hasNext) {
				onItemPreload(pagable.next);
			}
		}}
		disabled={!pagable || !pagable.hasNext || isLoading}
		class="p-2 bg-white border rounded-full border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 disabled:cursor-not-allowed disabled:bg-white disabled:border-mauve-11 disabled:ring-mauve-11 disabled:text-mauve-11"
	>
		<AccessibleIcon label="Go to previous">
			<East />
		</AccessibleIcon>
	</button>
</div>
