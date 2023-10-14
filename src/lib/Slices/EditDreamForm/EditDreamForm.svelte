<script lang="ts">
	import { getContext } from 'svelte';

	import { superForm, superValidate } from 'sveltekit-superforms/client';
	import type { User } from 'lucia';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { page } from '$app/stores';

	import { DREAMS_KEYS } from '$routes/experimental/dreams/constants';

	import { Button } from '$components/Button';
	import { EmojiPicker } from '$components/EmojiPicker';
	import { Dialog } from '$components/Dialog';

	import type { NotificationContext } from '$provider/NotificationProvider/types';

	import {
		editDreamFormSchema,
		DEFAULT_EDIT_DREAM_FORM,
		type EditDreamFormSchema
	} from './constants';
	import { AccessibleIcon } from '$components/AccessibleIcon';

	import EditIcon from '$assets/Icons/24/edit.svg?component';
	import type { Dream } from '$types';
	import { superFormWithContext } from './superFormWithContext';
	import { compareFlatObject } from '$utils';
	import type { Writable } from 'svelte/store';
	import TextArea from './TextArea.svelte';

	export let user: User;
	export let dream: Dream;

	const queryClient = useQueryClient();

	$: unsuccessfulSubmitted = $page.status !== 200;

	// const editDreamMutation = createMutation({
	// 	mutationFn: async (editDream) => {
	// 		const formData = new FormData();
	// 		formData.append('dreamId', editDream.dreamId);
	// 		formData.append('text', editDream.text);
	// 		formData.append('emoji', editDream.emoji);
	// 		formData.append('userId', editDream.userId);

	// 		const response = await fetch('/experimental/dreams?/edit', {
	// 			method: 'POST',
	// 			body: formData
	// 		});

	// 		console.log('response', response.status, response.statusText);
	// 		return false;
	// 	},
	// 	onMutate: async (editedDream: EditDreamFormSchema) => {
	// 		// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
	// 		await queryClient.cancelQueries({
	// 			queryKey: DREAMS_KEYS.id(editedDream.dreamId)
	// 		});

	// 		// Snapshot the previous value
	// 		const previousDream = queryClient.getQueryData<Dream>(
	// 			DREAMS_KEYS.id(editedDream.dreamId)
	// 		);

	// 		// Optimistically update to the new value
	// 		if (previousDream) {
	// 			queryClient.setQueryData<Dream>(
	// 				DREAMS_KEYS.id(editedDream.dreamId),
	// 				{
	// 					...previousDream,
	// 					updated_at: new Date().toISOString(),
	// 					text: editedDream.text,
	// 					emoji: editedDream.emoji
	// 				}
	// 			);
	// 		}

	// 		return { editedDream, previousDream };
	// 	},
	// 	// If the mutation fails, use the context returned from onMutate to roll back
	// 	onError: (err, variables, context) => {
	// 		console.log('err', err, variables, context);

	// 		if (context?.previousDream) {
	// 			queryClient.setQueryData<Dream>(
	// 				DREAMS_KEYS.id(variables.dreamId),
	// 				context.previousDream
	// 			);
	// 		}
	// 	},
	// 	// Always refetch after error or success:
	// 	onSettled: (data: unknown, error: any, variables) => {
	// 		console.log('settled', data, error, variables);
	// 		queryClient.invalidateQueries({
	// 			queryKey: DREAMS_KEYS.id(variables.dreamId)
	// 		});
	// 	}
	// });

	const {
		enhance,
		form,
		errors,
		tainted,
		constraints,
		message,
		submitting,
		delayed,
		formId
	} = superFormWithContext($page.data.editDreamForm, {
		id: `editDreamForm-${dream.id}`,
		validators: editDreamFormSchema,
		clearOnSubmit: 'none',
		taintedMessage: null,
		invalidateAll: false,
		resetForm: false,
		applyAction: false,
		onSubmit: async ({ formData, cancel }) => {
			const validated = await superValidate(
				formData,
				editDreamFormSchema
			);
			if (validated.valid) {
				await queryClient.cancelQueries({
					queryKey: DREAMS_KEYS.id(validated.data.dreamId)
				});

				// Snapshot the previous value
				const previousDream = queryClient.getQueryData<Dream>(
					DREAMS_KEYS.id(validated.data.dreamId)
				);

				// Optimistically update to the new value
				if (previousDream) {
					queryClient.setQueryData<Dream>(
						DREAMS_KEYS.id(validated.data.dreamId),
						{
							...previousDream,
							updated_at: new Date().toISOString(),
							text: validated.data.text,
							emoji: validated.data.emoji
						}
					);
				}

				return { data: validated.data, previousDream };
			}

			cancel();
		},
		onUpdated: (event, context) => {
			if ($setClose) {
				$setClose();
			}
			if (context?.previousDream) {
				// if the form data is different from the previous dream data
				// update the query cache
				if (!compareFlatObject(event.form.data, context.data)) {
					queryClient.setQueryData<Dream>(
						DREAMS_KEYS.id(context.data.dreamId),
						{
							...context.previousDream,
							updated_at: new Date().toISOString(),
							text: event.form.data.text,
							emoji: event.form.data.emoji
						}
					);
				}
			}

			if (context) {
				// Always refetch after error or success:
				queryClient.invalidateQueries({
					queryKey: DREAMS_KEYS.id(context.data.dreamId)
				});
			}
		},
		onError: (event, context) => {
			if (context?.previousDream) {
				queryClient.setQueryData<Dream>(
					DREAMS_KEYS.id(context.data.dreamId),
					context.previousDream
				);
			}
			if (context) {
				queryClient.invalidateQueries({
					queryKey: DREAMS_KEYS.id(context.data.dreamId)
				});
			}
			console.log('onError', context);
		}
	});

	$: getValValidationClass = (
		key: keyof EditDreamFormSchema,
		classes: {
			successClass?: string;
			errorClass?: string;
			defaultClass?: string;
		}
	) => {
		const error = $errors[key];
		if (error && error.length > 0) {
			return classes.errorClass ?? '';
		}
		// after an unsuccessful submission each field should be in an error or success state
		if (
			(key in $errors && $tainted && $tainted[key]) ||
			unsuccessfulSubmitted
		) {
			return classes.successClass ?? '';
		}

		return classes.defaultClass ?? '';
	};

	const notificationContext: NotificationContext = getContext('notification');

	$: if ($submitting) {
		notificationContext.removeNotification(
			`editDreamFormMessage-${dream.id}`
		);
	}

	$: if ($message) {
		// TODO: debug this. this is executed twice after a successful submission
		notificationContext.addNotification({
			id: `editDreamFormMessage-${dream.id}`,
			variant: $message.type,
			priority: $message.type === 'red' ? true : false,
			html: $message.html,
			closeIcon: true,
			progress: true
		});

		$message = undefined;
	}

	$: $form.userId = user.userId;
	$: $form.dreamId = dream.id;
	$: $form.text = dream.text;
	$: $form.emoji = dream.emoji;

	// const setUserId = (userIdFromForm: string) => {
	// 	if (userIdFromForm === user.userId) return;
	// 	$form.userId = user.userId;
	// };

	// $: setUserId($form.userId);

	// let setEmojiValue: (value: string) => void = () => {};
	// $: setEmojiValue($form.emoji);

	let setEmojiValue: (e: string) => void;
	let setClose: Writable<(() => void) | undefined> | undefined;

	// 	contentClass=" "
</script>

<Dialog
	disabled={$submitting}
	triggerClass="bg-white hover:bg-blue-5"
	title="Title"
	description="description"
	contentContainerClass="fixed inset-0 pointer-events-none  flex justify-center items-end md:items-center p-2"
	contentClass="h-96 bg-mauve-2 pointer-events-auto w-full max-w-xs max-h-full p-2 overlow-y-auto overflow-x-hidden border border-mauve-12
	opacity-0 
	group-data-[state=open]/dr-ds-dialog:opacity-100 


	translate-y-3/4
	md:translate-y-[20%]
	scale-80 
	group-data-[state=open]/dr-ds-dialog:transform-none 
	transition-[transform,opacity] origin-bottom"
	bind:setClose
>
	<AccessibleIcon label="edit" slot="trigger">
		<EditIcon
			class="block w-auto h-full group-hover:animate-spin icon-mauve-11"
		/>
	</AccessibleIcon>
	<form
		use:enhance
		method="POST"
		action="/experimental/dreams?/edit"
		class="flex flex-col"
	>
		<div class="flex flex-col items-start w-full group">
			<p class="h-4 text-xs">
				{#if $message && 'invalidValues'}
					{@html $message.html}
				{/if}
			</p>
		</div>

		<div class="flex flex-col items-start w-full group">
			<p class="h-4 text-xs">
				{#if $errors.userId}
					{$errors.userId[0]}
				{/if}
			</p>
		</div>

		<input type="hidden" name="userId" bind:value={$form.userId} />
		<input type="hidden" name="dreamId" bind:value={$form.dreamId} />
		<div class="flex flex-col items-start w-full group">
			<label
				for="text"
				class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
					'text',
					{
						successClass: 'group-focus-within:bg-green-5',
						errorClass: 'group-focus-within:bg-red-5',
						defaultClass: 'group-focus-within:bg-blue-5'
					}
				)}"
			>
				Wovon träumst du nachts?*
			</label>
			<textarea
				rows="3"
				name="text"
				id="text"
				class="py-2 px-4 border-mauve-12 rounded-none border group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent w-full resize-none {getValValidationClass(
					'text',
					{
						successClass: 'to-green-5',
						errorClass: 'to-red-5'
					}
				)}"
				placeholder="Ganz viele Schafe..."
				bind:value={$form.text}
				aria-invalid={$errors.text ? 'true' : undefined}
				disabled={$submitting}
				{...$constraints.text}
			/>

			<p class="h-4 text-xs">
				{#if $errors.text}
					{$errors.text[0]}
				{/if}
			</p>
		</div>
		<div class="flex flex-col items-start group">
			<EmojiPicker
				name="emoji"
				disabled={$submitting}
				defaultValue={$form.emoji}
				bind:setValue={setEmojiValue}
				on:valueChange={(e) => {
					$form.emoji = e.detail.value;
				}}
			/>

			<p class="h-4 text-xs">
				{#if $errors.emoji}
					{$errors.emoji[0]}
				{/if}
			</p>
		</div>

		<Button
			class="block bg-white hover:bg-blue-5"
			disabled={$submitting}
			type="submit"
		>
			{#if $delayed}
				<span class="px-1 -ml-2 bg-white rounded-full">🕸</span>
				<span class="col-start-2">Submitting...</span>
			{:else}
				<span>Submit</span>
			{/if}
		</Button>
	</form>
</Dialog>
