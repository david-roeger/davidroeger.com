<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Typography from '@tiptap/extension-typography';
	import Highlight from '@tiptap/extension-highlight';
	import Link from '@tiptap/extension-link';

	import type { Node } from '@tiptap/pm/model';
	import * as Popper from '../../Primitives/Popper';
	import { useRect } from '$lib/Primitives/Popper/useRect';
	import type { Rect } from '$lib/Primitives/Popper/types';
	import type { Writable } from 'svelte/store';
	import { useSize } from '$lib/Primitives/Popper/useSize';
	import { getPlacementData } from '$lib/Primitives/Popper/popper';
	import { convertStyleString } from '$lib/Utils';
	import { clickOutside } from '$lib/Actions';

	let container: Element;
	let editor: Editor;
	let pos = 0;
	let currentBlock: Element | undefined;
	let showToolbar = false;
	let toolbar: HTMLElement | undefined;

	let BLOCK_ELEMENTS = {
		ORDERED_LIST: {
			NAME: 'orderedList',
			TAG: 'OL'
		},
		UNORDERED_LIST: {
			NAME: 'bulletList',
			TAG: 'UL'
		},
		HEADING: {
			NAME: 'heading',
			TAG: 'H?'
		},
		PARAGRAPH: {
			NAME: 'paragraph',
			TAG: 'P'
		}
	} as const;

	const findParentBlockAndPosition = (
		node: Node,
		pos: number
	): { node: Node | undefined; pos: number | undefined } => {
		// check if the node is decendant of a list
		if (node.type.isBlock) {
			return { node, pos };
		}

		const position = node.resolve(0);
		const parent = position.parent;
		if (parent) {
			return findParentBlockAndPosition(parent, pos);
		}

		return { node: undefined, pos: undefined };
	};

	onMount(() => {
		editor = new Editor({
			element: container,
			extensions: [
				StarterKit,
				Typography,
				Highlight,
				Link.configure({
					openOnClick: false
				})
			],
			content: '<p>Hello World! 🌍️ </p>',
			onTransaction: ({ editor: transactionEditor, transaction }) => {
				editor = editor;

				const computedStart =
					transaction.selection.$anchor.pos -
					transaction.selection.$anchor.parentOffset;

				let parentBlockAndPosition = findParentBlockAndPosition(
					transaction.selection.$anchor.node(),
					computedStart
				);

				pos = parentBlockAndPosition.pos ?? 0;
				currentBlock = transactionEditor.view.domAtPos(pos)
					.node as Element;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	const getCurrentBlockTag = (editor: Editor) => {
		if (editor.isActive(BLOCK_ELEMENTS.UNORDERED_LIST.NAME)) {
			return BLOCK_ELEMENTS.UNORDERED_LIST.TAG;
		} else if (editor.isActive(BLOCK_ELEMENTS.ORDERED_LIST.NAME)) {
			return BLOCK_ELEMENTS.ORDERED_LIST.TAG;
		} else if (editor.isActive(BLOCK_ELEMENTS.PARAGRAPH.NAME)) {
			return BLOCK_ELEMENTS.PARAGRAPH.TAG;
		} else if (editor.isActive(BLOCK_ELEMENTS.HEADING.NAME)) {
			return BLOCK_ELEMENTS.HEADING.TAG;
		}
		return undefined;
	};

	const getCurrentComputedBlock = (
		tag: string | undefined,
		block: Element | undefined
	) => {
		if (!block) return undefined;
		if (!tag) return block;
		if (
			block.tagName === tag ||
			(tag === BLOCK_ELEMENTS.HEADING.TAG &&
				block.tagName.match(/^H[\d]$/gm))
		) {
			return block;
		}
		return block.tagName === tag ? block : block.closest(tag) ?? block;
	};

	$: currentBlockTag = editor ? getCurrentBlockTag(editor) : undefined;
	$: currentComputedBlock = getCurrentComputedBlock(
		currentBlockTag,
		currentBlock
	);

	let triggerRect: Writable<Rect | undefined>;
	let contentSize: Writable<
		| {
				size: {
					width: number;
					height: number;
				};
				onDestroy: () => void;
		  }
		| undefined
	>;

	let toolbarStyles = '';

	$: {
		if (currentComputedBlock) {
			triggerRect = useRect(currentComputedBlock);
		}
		if (toolbar && !$contentSize) {
			contentSize = useSize(toolbar as HTMLElement);
		}
		if (
			$triggerRect &&
			$triggerRect.rect &&
			$contentSize &&
			$contentSize.size
		) {
			const { popperStyles } = getPlacementData({
				triggerRect: $triggerRect.rect,
				popperSize: $contentSize.size,
				side: 'top',
				sideOffset: 8,
				align: 'start',
				alignOffset: undefined,
				shouldAvoidCollisions: true,
				collisionBoundariesRect: DOMRect.fromRect({
					width: window.innerWidth,
					height: window.innerHeight,
					x: 0,
					y: 0
				}),
				collisionTolerance: undefined
			});

			let string = '';

			for (const [key, value] of Object.entries(popperStyles)) {
				string += `${convertStyleString(key)}: ${value};
				`;
			}

			toolbarStyles = string;
		}
	}

	const setParagraph = (editor: Editor) => {
		editor.chain().focus().setParagraph().run();
	};

	const setHeading = (editor: Editor, level: 1 | 2 | 3 | 4 | 5 | 6) => {
		editor.chain().focus().toggleHeading({ level }).run();
	};

	const setLink = (editor: Editor) => {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		// update link
		editor
			.chain()
			.focus()
			.extendMarkRange('link')
			.setLink({ href: url })
			.run();
	};

	const TEXT_ELEMENTS = [
		{
			label: BLOCK_ELEMENTS.PARAGRAPH.TAG,
			setCommand: (editor: Editor) => setParagraph(editor),
			activeCommand: BLOCK_ELEMENTS.PARAGRAPH.NAME
		},
		{
			label: 'H1',
			command: 'toggleHeading',
			activeCommand: BLOCK_ELEMENTS.HEADING.NAME,
			setCommand: (editor: Editor) => setHeading(editor, 1),
			args: { level: 1 }
		},
		{
			label: 'H2',
			command: 'toggleHeading',
			activeCommand: BLOCK_ELEMENTS.HEADING.NAME,
			setCommand: (editor: Editor) => setHeading(editor, 2),
			args: { level: 2 }
		},
		{
			label: 'H3',
			command: 'toggleHeading',
			activeCommand: BLOCK_ELEMENTS.HEADING.NAME,
			setCommand: (editor: Editor) => setHeading(editor, 3),
			args: { level: 3 }
		},
		{
			label: 'H4',
			command: 'toggleHeading',
			activeCommand: BLOCK_ELEMENTS.HEADING.NAME,
			setCommand: (editor: Editor) => setHeading(editor, 4),
			args: { level: 4 }
		},
		{
			label: 'H5',
			command: 'toggleHeading',
			activeCommand: BLOCK_ELEMENTS.HEADING.NAME,
			setCommand: (editor: Editor) => setHeading(editor, 5),
			args: { level: 5 }
		},
		{
			label: 'H6',
			command: 'toggleHeading',
			activeCommand: BLOCK_ELEMENTS.HEADING.NAME,
			setCommand: (editor: Editor) => setHeading(editor, 6),
			args: { level: 6 }
		}
	];

	const getActiveTextElement = (editor: Editor) => {
		for (let i = 0; i < TEXT_ELEMENTS.length; i++) {
			const element = TEXT_ELEMENTS[i];
			if (editor.isActive(element.activeCommand, element.args)) {
				return element.label;
			}
		}

		return '?';
	};

	const getBlockType = (
		currentBlockTag: string | undefined,
		currentComputedBlock: Element | undefined
	) => {
		if (!currentComputedBlock || !currentBlockTag) {
			return undefined;
		}
		if (currentBlockTag === BLOCK_ELEMENTS.HEADING.TAG) {
			return BLOCK_ELEMENTS.HEADING.NAME;
		} else if (currentBlockTag === BLOCK_ELEMENTS.PARAGRAPH.TAG) {
			return BLOCK_ELEMENTS.PARAGRAPH.NAME;
		} else if (
			currentBlockTag === BLOCK_ELEMENTS.ORDERED_LIST.TAG ||
			currentBlockTag === BLOCK_ELEMENTS.UNORDERED_LIST.TAG
		) {
			return 'list';
		}

		return undefined;
	};
</script>

<section
	use:clickOutside={() => {
		showToolbar = false;
	}}
	on:focusin={() => {
		showToolbar = true;
	}}
>
	<section
		class="editor px-2 grow md:grow-0 md:w-3/4 md:border-r border-mauve-6 md:p-8 xl:p-16 bg-white/[.85]"
		bind:this={container}
	/>
	<div
		bind:this={toolbar}
		style={toolbarStyles}
		class="flex-wrap bg-white transition-[transform] {showToolbar
			? 'flex'
			: 'hidden'}"
	>
		{#if editor}
			<p>{getBlockType(currentBlockTag, currentComputedBlock)}</p>
			<Popper.Root defaultOpen={false}>
				<Popper.Trigger
					class="min-w-[42px] min-h-[42px] p-2 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 ring-inset"
				>
					<span>{getActiveTextElement(editor)}</span>
				</Popper.Trigger>
				<Popper.Content
					class="flex flex-col bg-white"
					side="bottom"
					align="start"
					focusTrapOptions={{
						initialFocus: '[data-active]'
					}}
				>
					{#each TEXT_ELEMENTS as element (element.label)}
						<button
							class="min-w-[42px] min-h-[42px] border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 ring-inset"
							on:click={() => element.setCommand(editor)}
							class:bg-green-5={editor.isActive(
								element.activeCommand,
								element.args
							)}
							data-active={editor.isActive(
								element.activeCommand,
								element.args
							)
								? 'true'
								: undefined}
						>
							{element.label}
						</button>
					{/each}
				</Popper.Content>
			</Popper.Root>

			<button
				class="min-w-[42px] min-h-[42px] p-2 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 ring-inset"
				on:click={() => editor.chain().focus().toggleBold().run()}
				class:bg-green-5={editor.isActive('bold')}
			>
				B
			</button>
			<button
				class="min-w-[42px] min-h-[42px] p-2 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 ring-inset"
				on:click={() => editor.chain().focus().toggleItalic().run()}
				class:bg-green-5={editor.isActive('italic')}
			>
				I
			</button>
			<button
				class="min-w-[42px] min-h-[42px] p-2 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 ring-inset"
				on:click={() => setLink(editor)}
				class:bg-green-5={editor.isActive('link')}
			>
				🔗
			</button>
		{/if}
	</div>
</section>

<style global>
	.editor > * > * {
		@apply mb-2;
	}
	.editor > * > *:last-child {
		@apply mb-0;
	}
	.editor h1 {
		@apply text-6xl;
	}
	.editor h2 {
		@apply text-4xl;
	}

	.editor h3 {
		@apply text-2xl;
	}

	.editor h4 {
		@apply text-xl;
	}

	.editor ul li {
		@apply list-disc;
	}

	.editor ol li {
		@apply list-decimal;
	}

	.editor a {
		@apply underline;
	}
</style>
