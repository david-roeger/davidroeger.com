<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let defaultValue = '🧿';
	export let name: string;

	export let disabled = false;

	let req = false;
	export { req as required };

	let c = '';
	export { c as class };

	import { setContext, onMount, tick } from 'svelte';

	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext, EmojiData } from './types';
	import type { Writable } from 'svelte/store';

	import * as Popper from '$primitives/Popper';
	import * as VisuallyHidden from '$primitives/VisuallyHidden';
	import { Headline } from '$components/Headline';
	import { Button } from '$components/Button';

	import { hasParentOfType } from '$lib/Utils';
	import { emojiData } from './store';

	id++;
	const rootContext: RootContext = {
		id: `drds-emojiPicker-${id.toString()}`,
		name: name,
		required: req,
		activeValue: writable(defaultValue),
	};
	setContext('root', rootContext);

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
		value: $activeValue,
	});

	let root;
	let container: HTMLDivElement;

	let renderInput = false;

	async function getEmojiData() {
		if ($emojiData) {
			return $emojiData;
		}

		const res = await fetch(`/api/emojiData.json`);
		if (res.ok) {
			const data = await res.json();
			$emojiData = data as EmojiData;
			return data as EmojiData;
		} else {
			throw new Error(res.statusText);
		}
	}

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

	let categoryElements = [];
	let emojiElements = [];
	const handleKeyDown = (e: KeyboardEvent) => {
		if ($emojiData) {
			if (!categoryElements.length) {
				categoryElements = Array.from(
					container.querySelectorAll(':scope div[data-state]'),
				);
				categoryElements.forEach((categoryElement, index) => {
					emojiElements[index] = Array.from(
						categoryElement.querySelectorAll(
							':scope button[data-state]',
						),
					);
				});
			}
			if (!categoryElements.length || !emojiElements.length) {
				return;
			}

			const activeCategory: HTMLDivElement = categoryElements.find(
				(categoryElement) =>
					categoryElement.contains(document.activeElement),
			);

			const activeEmoji = document.activeElement as HTMLButtonElement;

			const categoryIndex = activeCategory
				? parseInt(activeCategory.dataset.state)
				: 0;
			const emojiIndex = activeEmoji
				? parseInt(activeEmoji.dataset.state)
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
						if (
							newEmojiIndex ===
							emojiElements[categoryIndex].length
						) {
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
								const diff = Math.max(
									0,
									empojisInLastRow - pos,
								);
								emojiElements[categoryElements.length - 1][
									emojiElements[categoryElements.length - 1]
										.length -
										1 -
										diff
								].focus();
							} else {
								const pos = emojiIndex & emojisPerRow;
								const empojisInLastRow =
									(emojiElements[newCategoryIndex].length -
										1) %
									emojisPerRow;
								const diff = Math.max(
									0,
									empojisInLastRow - pos,
								);
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
						if (
							newEmojiIndex >= emojiElements[categoryIndex].length
						) {
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
									emojiElements[newCategoryIndex][
										pos
									].focus();
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
						emojiElements[emojiElements.length - 1]
					].focus();
					e.preventDefault();
					e.stopPropagation();
					break;
				default:
					break;
			}
		}
	};

	const handlePopperOpen = async (open: boolean) => {
		if (container && open) {
			await tick();
			const emoji: HTMLButtonElement = container.querySelector(
				`:scope button[data-emoji="${$activeValue}"]`,
			);
			if (emoji) emoji.focus();
		}
	};

	let closePopper: Writable<() => void | undefined>;
	let popperOpen: Writable<boolean | undefined>;

	$: handlePopperOpen($popperOpen);
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
	<Popper.Root defaultOpen={false} bind:closePopper bind:popperOpen>
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
			class="bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
			side="bottom"
			align="start"
			on:keydown={handleKeyDown}
		>
			<div
				bind:this={container}
				class="relative w-full max-w-[282px] max-h-[360px] overflow-auto"
			>
				<Headline as="h2" type="tertiary" class="border-b-0 ">
					Choose an emoji:
				</Headline>
				{#await getEmojiData()}
					<p>...waiting</p>
				{:then data}
					{#each data.categories as category, categoryIndex (category.id)}
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
											setEmoji(
												data.emojis[emoji].skins[0]
													.native,
											);
										}}
										data-state={emojiIndex}
										data-emoji={data.emojis[emoji].skins[0]
											.native}
										class="m-0.5 w-[34px] flex justify-center !p-1 rounded-full"
									>
										{data.emojis[emoji].skins[0].native}
									</Button>
								{/each}
							</div>
						</div>
					{/each}
				{:catch error}
					<p class="p-2 text-sm text-mauve-11">
						Error: {error.message} 😭
					</p>
				{/await}
			</div>
		</Popper.Content>
	</Popper.Root>
</div>
