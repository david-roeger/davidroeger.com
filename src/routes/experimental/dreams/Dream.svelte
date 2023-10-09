<script lang="ts">
	import { page } from '$app/stores';

	import { Headline } from '$components/Headline';
	import EditDreamForm from '$slices/EditDreamForm/EditDreamForm.svelte';

	import type { Dream } from '$types';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { DREAMS_KEYS } from './constants';

	export let id: string;

	const queryFn = async ({ id }: { id: string }) =>
		await fetch(`/_api/dreams/${id}`).then(async (res) => {
			const data = await res.json();
			if (!res.ok) throw data;
			const dream = data as Dream;

			return dream;
		});

	$: query = createQuery({
		queryKey: DREAMS_KEYS.id(id),
		queryFn: () => queryFn({ id })
	});

	$: active = $page.url.hash === `#${id}`;

	const formatDate = (date: string) => {
		const parsed = new Date(date);
		return parsed.toLocaleDateString('en-GB');
	};

	$: user = $page.data.user;
</script>

{#if $query.data}
	<li
		class="flex flex-col m-1 border border-mauve-6 scroll-m-2 {active
			? 'ring-1 ring-mauve-6'
			: ''}"
		{id}
	>
		<div class="flex bg-white">
			<span class="w-10 p-2 text-center border-b border-mauve-6 group">
				<span
					class="block transition-transform group-hover:animate-cool-wiggle"
				>
					{$query.data.emoji}
				</span>
			</span>

			<Headline
				as="h2"
				type="quaternary"
				containerClass="grow border-l flex"
			>
				{formatDate($query.data.created_at)}
				<span class="text-mauve-11">
					({formatDate($query.data.updated_at)})
				</span>
			</Headline>

			<!-- edit dialog-->
			{#if user}
				<EditDreamForm {user} dream={$query.data} />
				<!-- <Dialog
				disabled={$editDreamFormState === FORM_STATE.SUBMITTING ||
					!data.profile}
				triggerClass="w-10 !px-2 text-center transition-colors border-t-0 border-r-0 !border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1 ring-inset {$editDreamFormState !==
					FORM_STATE.SUBMITTING && data.profile
					? 'group'
					: ''}"
				title="Title"
				description="description"
				bind:setClose={setEditDreamDialogClose}
			>
				<AccessibleIcon label="edit" slot="trigger">
					<EditIcon
						class="block w-auto h-full group-hover:animate-spin icon-mauve-11"
					/>
				</AccessibleIcon>
				<form
					method="POST"
					action="/experimental/dreams/actions?/edit"
					class="bg-white/[.85] flex flex-col"
					use:editDreamFormEnhance
				>
					<div
						class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
					>
						<p class="h-4 text-xs">
							{#if $editDreamForm && 'invalidValues' in $editDreamForm && $editDreamForm.invalidValues?.default && editDreamId === $query.data.id}
								{$editDreamForm.invalidValues.default}
							{/if}
						</p>
					</div>

					<input type="hidden" name="dreamId" value={$query.data.id} />
					<div
						class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
					>
						<label
							for="text"
							class="px-4 py-1 text-xs border border-b-0 rounded-none border-mauve-12 ring-mauve-12 group-focus-within:ring-1"
						>
							Wovon träumst du nachts?
						</label>
						<textarea
							name="text"
							id="text"
							class="w-full px-4 py-2 border rounded-none resize-none border-mauve-12 group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent"
							placeholder="Ganz viele Schafe..."
							value={editDreamId === $query.data.id
								? editDreamText
								: $query.data.text}
							disabled={$editDreamFormState ===
								FORM_STATE.SUBMITTING}
						/>

						<p class="h-4 text-xs">
							{#if $editDreamForm && 'invalidValues' in $editDreamForm && $editDreamForm.invalidValues?.text && editDreamId === $query.data.id}
								{$editDreamForm.invalidValues.text}
							{/if}
						</p>
					</div>
					<div
						class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
					>
						<EmojiPicker
							name="emoji"
							defaultValue={editDreamId === $query.data.id
								? editDreamEmoji
								: $query.data.emoji
								? $query.data.emoji
								: data?.emojiMap?.[$query.data.id]}
							disabled={$editDreamFormState ===
								FORM_STATE.SUBMITTING}
						/>
						<p class="h-4 text-xs">
							{#if $editDreamForm && 'invalidValues' in $editDreamForm && $editDreamForm.invalidValues?.emoji && editDreamId === $query.data.id}
								{$editDreamForm.invalidValues.emoji}
							{/if}
						</p>
					</div>

					<Button
						class="block bg-white hover:bg-green-5"
						disabled={$editDreamFormState ===
							FORM_STATE.SUBMITTING || !data.profile}
						type="submit"
					>
						Update
					</Button>
				</form>
			</Dialog> -->
			{/if}

			<!-- remove dialog-->
			<!-- {#if data.profile}
<Dialog
    disabled={$removeDreamFormState ===
        FORM_STATE.SUBMITTING || !data.profile}
    triggerClass="w-10 !px-2 text-center transition-colors border-t-0 border-r-0 !border-mauve-6 focus:outline-none ring-mauve-6 focus:ring-1 ring-inset {$removeDreamFormState !==
        FORM_STATE.SUBMITTING && data.profile
        ? 'group'
        : ''}"
    title="Title"
    description="description"
    bind:setClose={setRemoveDreamDialogClose}
>
    <AccessibleIcon label="delete" slot="trigger">
        <CloseIcon />
    </AccessibleIcon>
    <form
        method="POST"
        action="/experimental/dreams/actions?/remove"
        class="bg-white/[.85] flex flex-col"
        use:removeDreamFormEnhance
    >
        <div
            class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
        >
            <p class="h-4 text-xs">
                {#if $removeDreamForm && 'invalidValues' in $removeDreamForm && $removeDreamForm.invalidValues?.default && removeDreamId === $query.data.id}
                    {$removeDreamForm.invalidValues.default}
                {/if}
            </p>
        </div>

        <input
            type="hidden"
            name="dreamId"
            value={$query.data.id}
        />
        <div
            class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
        >
            <Close
                class="block px-4 py-2 transition-colors bg-white border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 hover:bg-green-5"
            >
                Abbrechen
            </Close>
            <Button
                class="block bg-red-5"
                type="submit"
                disabled={$removeDreamFormState ===
                    FORM_STATE.SUBMITTING || !data.profile}
            >
                Löschen
            </Button>
        </div>
    </form>
</Dialog>
{/if} -->
		</div>

		<div class="p-2 bg-white/[.85] grow">
			<p class="text-sm text-mauve-11">{$query.data.id}</p>

			<p class="whitespace-pre-line">{$query.data.text}</p>
		</div>
	</li>
{/if}
