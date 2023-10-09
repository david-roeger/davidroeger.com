<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let defaultValue = '🧿';
	export let name: string;

	export let disabled = false;

	let req = false;
	export { req as required };

	import { setContext, onMount } from 'svelte';

	import { derived, writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext, EmojiData, EmojiValue } from './types';
	import type { Writable } from 'svelte/store';

	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import Fuse from 'fuse.js';

	import * as Popper from '$primitives/Popper';
	import * as VisuallyHidden from '$primitives/VisuallyHidden';
	import { Headline } from '$components/Headline';
	import { Button } from '$components/Button';
	import { AccessibleIcon } from '$components/AccessibleIcon';

	import { debounce, hasParentOfType } from '$utils';

	import Spinner from '$assets/Icons/24/spinner.svg?component';

	import { EMOJI_FUSE_KEYS, EMOJI_KEYS } from './constants';

	// TODO: this blocks rendering
	id++;
	const rootContext: RootContext = {
		id: `drds-emojiPicker-${id.toString()}`,
		name: name,
		required: req,
		activeValue: writable(defaultValue)
	};
	setContext('root', rootContext);

	const dataQuery = createQuery({
		queryKey: EMOJI_KEYS.data(),
		queryFn: () =>
			fetch(`/_api/emoji/data.json`).then((res) => {
				if (res.ok) {
					return res.json() as Promise<EmojiData>;
				} else {
					throw new Error(res.statusText);
				}
			}),
		staleTime: Infinity
	});

	const indexQuery = createQuery({
		queryKey: EMOJI_KEYS.index(),
		queryFn: () =>
			fetch(`/_api/emoji/index.json`).then((res) => {
				if (res.ok) {
					return res.json() as Promise<
						{
							keys: string[];
							records: Fuse.FuseIndexRecords;
						}[]
					>;
				} else {
					throw new Error(res.statusText);
				}
			}),
		staleTime: Infinity
	});

	const search = writable('');

	const fuseOptions = {
		includeScore: true,
		// shouldSort: true,
		// includeMatches: false,
		// findAllMatches: false,
		// minMatchCharLength: 1,
		// location: 0,
		// threshold: 0.6,
		// distance: 100,
		ignoreLocation: true,
		ignoreFieldNorm: true,
		// fieldNormWeight: 1,
		keys: EMOJI_FUSE_KEYS
	};

	const fuse = derived(
		[dataQuery, indexQuery],
		([$dataQuery, $indexQuery]) => {
			if ($dataQuery.data && $indexQuery.data) {
				return new Fuse(
					Object.values($dataQuery.data.emojis),
					fuseOptions,
					Fuse.parseIndex($indexQuery.data)
				);
			} else {
				return undefined;
			}
		}
	);
	const searchedQuery = createQuery<Fuse.FuseResult<EmojiValue>[]>(
		derived([search, fuse, dataQuery], ([$search, $fuse, $dataQuery]) => ({
			queryKey: EMOJI_KEYS.search($search),
			queryFn: () => {
				if (!$fuse) {
					throw new Error('Fuse is not defined');
				}

				if (!$search) {
					if ($dataQuery.data) {
						return Object.values($dataQuery.data.emojis).map(
							(emoji, idx) => ({
								item: emoji,
								refIndex: idx,
								score: 1
							})
						);
					}

					throw new Error('No data');
				}

				return $fuse.search($search);
			},
			enabled: !!$fuse,
			placeholderData: keepPreviousData
		}))
	);

	const { activeValue, required } = rootContext;

	const setEmoji = (value: string) => {
		if ($activeValue !== value) {
			$activeValue = value;
		}
		if ($closePopper) {
			$closePopper();
		}
	};

	const dispatch = createEventDispatcher<{
		valueChange: { value: string };
	}>();

	$: dispatch('valueChange', {
		value: $activeValue
	});

	let root: HTMLDivElement;
	let container: HTMLDivElement;

	let renderInput = false;

	onMount(() => {
		if (hasParentOfType(root, 'form')) {
			renderInput = true;
		}
	});

	const leftKey = 'ArrowLeft';
	const rightKey = 'ArrowRight';
	const upKey = 'ArrowUp';
	const downKey = 'ArrowDown';

	const emojisPerRow = 7;

	const handleKeyDown = (e: KeyboardEvent) => {
		const categoryElements: HTMLDivElement[] = Array.from(
			container.querySelectorAll(':scope div[data-state]')
		);

		const emojiElements: HTMLDivElement[][] = [];
		categoryElements.forEach((categoryElement, index) => {
			emojiElements[index] = Array.from(
				categoryElement.querySelectorAll(':scope button[data-state]')
			);
		});

		if (!categoryElements.length || !emojiElements.length) {
			return;
		}

		const activeCategory = categoryElements.find((categoryElement) =>
			categoryElement.contains(document.activeElement)
		);

		const activeEmoji = document.activeElement as HTMLButtonElement;

		const categoryIndex = activeCategory
			? parseInt(activeCategory.dataset.state ?? '')
			: 0;
		const emojiIndex = activeEmoji
			? parseInt(activeEmoji.dataset.state ?? '')
			: 0;

		switch (e.key) {
			case leftKey:
				if (!activeCategory) {
					emojiElements[0][0].focus();
				} else {
					const newEmojiIndex = emojiIndex - 1;
					if (newEmojiIndex === -1) {
						const newCategoryIndex = categoryIndex - 1;
						if (newCategoryIndex === -1) {
							emojiElements[categoryElements.length - 1][
								emojiElements[categoryElements.length - 1]
									.length - 1
							].focus();
						} else {
							emojiElements[newCategoryIndex][
								emojiElements[newCategoryIndex].length - 1
							].focus();
						}
					} else {
						emojiElements[categoryIndex][newEmojiIndex].focus();
					}
				}

				e.preventDefault();
				e.stopPropagation();
				break;
			case rightKey:
				if (!activeCategory) {
					emojiElements[0][0].focus();
				} else {
					const newEmojiIndex = emojiIndex + 1;
					if (newEmojiIndex === emojiElements[categoryIndex].length) {
						const newCategoryIndex = categoryIndex + 1;
						if (newCategoryIndex === categoryElements.length) {
							emojiElements[0][0].focus();
						} else {
							emojiElements[newCategoryIndex][0].focus();
						}
					} else {
						emojiElements[categoryIndex][newEmojiIndex].focus();
					}
				}

				e.preventDefault();
				e.stopPropagation();
				break;
			case upKey:
				if (!activeCategory) {
					emojiElements[0][0].focus();
				} else {
					const newEmojiIndex = emojiIndex - emojisPerRow; // move one emoji up
					// wrap around category if necessary
					// but if we're at the top of the category, move to the bottom or the row if present of the previous category
					if (newEmojiIndex < 0) {
						const newCategoryIndex = categoryIndex - 1;

						if (newCategoryIndex < 0) {
							const pos = emojiIndex & emojisPerRow;
							const empojisInLastRow =
								(emojiElements[categoryElements.length - 1]
									.length -
									1) %
								emojisPerRow;
							const diff = Math.max(0, empojisInLastRow - pos);
							emojiElements[categoryElements.length - 1][
								emojiElements[categoryElements.length - 1]
									.length -
									1 -
									diff
							].focus();
						} else {
							const pos = emojiIndex & emojisPerRow;
							const empojisInLastRow =
								(emojiElements[newCategoryIndex].length - 1) %
								emojisPerRow;
							const diff = Math.max(0, empojisInLastRow - pos);
							// move to the row of the previous category
							emojiElements[newCategoryIndex][
								emojiElements[newCategoryIndex].length -
									1 -
									diff
							].focus();
						}
					} else {
						emojiElements[categoryIndex][newEmojiIndex].focus();
					}
				}

				e.preventDefault();
				e.stopPropagation();
				break;
			case downKey: {
				if (!activeCategory) {
					emojiElements[0][0].focus();
				} else {
					const newEmojiIndex = emojiIndex + emojisPerRow; // move one emoji up
					// wrap around category if necessary
					// but if we're at the top of the category, move to the bottom or the row if present of the previous category
					if (newEmojiIndex >= emojiElements[categoryIndex].length) {
						// this could mean that we are in the pre last row of the category
						const pos = emojiIndex % emojisPerRow;
						const empojisInLastRow =
							(emojiElements[categoryIndex].length - 1) %
							emojisPerRow;
						if (pos > empojisInLastRow) {
							emojiElements[categoryIndex][
								emojiElements[categoryIndex].length - 1
							].focus();
						} else {
							const newCategoryIndex = categoryIndex + 1;
							if (
								newCategoryIndex >
								categoryElements.length - 1
							) {
								emojiElements[0][pos].focus();
							} else {
								// move to the row of the previous category
								emojiElements[newCategoryIndex][pos].focus();
							}
						}
					} else {
						emojiElements[categoryIndex][newEmojiIndex].focus();
					}
				}

				e.preventDefault();
				e.stopPropagation();
				break;
			}
			case 'Home':
				emojiElements[0][0].focus();
				e.preventDefault();
				e.stopPropagation();
				break;
			case 'End':
				emojiElements[emojiElements.length - 1][
					emojiElements[emojiElements.length - 1].length - 1
				].focus();
				e.preventDefault();
				e.stopPropagation();
				break;
			default:
				break;
		}
	};

	export const setValue = (value: string) => {
		$activeValue = value;
	};

	let closePopper: Writable<() => void | undefined>;

	function updateSearch(e: Event) {
		if (e.target) {
			$search = (e.target as HTMLInputElement).value;
		}
	}

	$: searchedQueryLoading =
		($searchedQuery.isFetching && $searchedQuery.isPlaceholderData) ||
		($search && $searchedQuery.isPending && !$searchedQuery.isFetching);
</script>

{#if renderInput}
	<input
		type="hidden"
		{name}
		value={$activeValue}
		aria-hidden="true"
		tabindex="-1"
		style="position: absolute; pointer-events: none; opacity: 0;"
		{required}
	/>
{/if}

<div bind:this={root}>
	<Popper.Root defaultOpen={false} bind:closePopper>
		<Popper.Trigger
			{disabled}
			class="p-2 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
		>
			<span>
				<VisuallyHidden.Root>
					Choose emoji. Current Emoji:
				</VisuallyHidden.Root>
				{$activeValue ?? 'Choose Emoji'}
			</span>
		</Popper.Trigger>
		<Popper.Content
			side="bottom"
			align="start"
			class="bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 scale-0 data-[state=open]:scale-100 transition-transform"
			on:keydown={handleKeyDown}
		>
			<div
				bind:this={container}
				class="relative w-[282px] max-h-[360px] overflow-auto"
			>
				<h2>
					<VisuallyHidden.Root>Choose an emoji:</VisuallyHidden.Root>
				</h2>

				{#if $dataQuery.data}
					<label
						class="z-10 pl-2 border-b border-mauve-12 ring-mauve-12 ring-inset focus-within:ring-1 top-0 bg-white/[.85] group flex items-center space-x-2"
						class:sticky={$search !== ''}
					>
						<AccessibleIcon
							label={searchedQueryLoading ? 'loading' : ''}
						>
							<Spinner
								class={searchedQueryLoading
									? 'animate-loading-1'
									: ''}
							/>
						</AccessibleIcon>
						<input
							id="search"
							class="py-2 pr-4 bg-transparent rounded-none w-full focus:outline-none"
							autocomplete="name"
							enterkeyhint="search"
							placeholder="Search"
							type="search"
							on:change={updateSearch}
							on:input={debounce(updateSearch, 50)}
							on:keydown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									if (!$searchedQuery.isFetching && $search) {
										const firstEmoji =
											container.querySelector(
												':scope button[data-state="0"]'
											);
										if (
											firstEmoji &&
											firstEmoji instanceof
												HTMLButtonElement
										) {
											firstEmoji.click();
										}
									}
								}

								if (e.key !== 'Escape') {
									e.stopPropagation();
								}
							}}
						/>
						<!-- on:change={updateSearchAndFocus}
						on:input={debounce(updateSearch, 200)}
						on:keydown|stopPropagation -->
					</label>
					{#if $search !== ''}
						{#if $searchedQuery.data}
							<div class="relative" data-state={0}>
								<div class="w-full flex flex-wrap p-2 -m-0.5">
									{#each $searchedQuery.data as result, index (result.refIndex)}
										<Button
											on:click={() => {
												if ($dataQuery.data) {
													setEmoji(
														$dataQuery.data.emojis[
															result.item.id
														].skins[0].native
													);
												}
											}}
											data-state={index}
											data-emoji={$dataQuery.data.emojis[
												result.item.id
											].skins[0].native}
											class="m-0.5 w-[34px] flex justify-center !p-1 rounded-full scroll-mt-[47px]"
										>
											{$dataQuery.data.emojis[
												result.item.id
											].skins[0].native}
										</Button>
									{:else}
										<p>No emojis found for "{$search}"</p>
									{/each}
								</div>
							</div>
						{:else if searchedQueryLoading}
							<p>...loading searched emojis</p>
						{:else}
							<p class="p-2 text-sm text-mauve-11">
								Searching for emojis failed 😭
							</p>
						{/if}
					{:else}
						{#each $dataQuery.data.categories as category, categoryIndex (category.id)}
							<div class="relative" data-state={categoryIndex}>
								<Headline
									as="h3"
									type="quaternary"
									containerClass="sticky top-0 bg-white/[.85]"
									class="border-b-0"
								>
									{category.id.charAt(0).toUpperCase() +
										category.id.slice(1)}
								</Headline>
								<div class="w-full flex flex-wrap p-2 -m-0.5">
									{#each category.emojis as emoji, emojiIndex (emoji)}
										<Button
											on:click={() => {
												if ($dataQuery.data) {
													setEmoji(
														$dataQuery.data.emojis[
															emoji
														].skins[0].native
													);
												}
											}}
											data-state={emojiIndex}
											data-emoji={$dataQuery.data.emojis[
												emoji
											].skins[0].native}
											class="m-0.5 w-[34px] flex justify-center !p-1 rounded-full scroll-mt-[47px]"
										>
											{$dataQuery.data.emojis[emoji]
												.skins[0].native}
										</Button>
									{/each}
								</div>
							</div>
						{/each}
					{/if}
				{:else if $dataQuery.isLoading || $dataQuery.isFetching}
					<p>...loading emojis</p>
				{:else}
					<p class="p-2 text-sm text-mauve-11">
						Something went wrong and all the emojis are gone 😭
					</p>
				{/if}
			</div>
		</Popper.Content>
	</Popper.Root>
</div>
