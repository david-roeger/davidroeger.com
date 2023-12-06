<script lang="ts">
	import { getContext } from 'svelte';

	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import { page } from '$app/stores';

	import { Button } from '$components/Button';

	import type { NotificationContext } from '$provider/NotificationProvider/types';

	import { getLoadingEmojis } from '$utils';

	import type { Colors } from '$utils/colors';
	import { contactFormSchema, type ContactFormSchema } from './constants';
	import { Input } from '$components/Input';
	import { INPUT_COLOR_CLASSES } from '$components/Input/constants';
	import SuperformsInput from '$components/Input/SuperformsInput.svelte';

	export let variant: Colors = 'default';

	export let borderTop = false;
	export let borderBottom = true;

	let c = '';
	export { c as class };

	$: unsuccessfulSubmitted = $page.status !== 200;

	const {
		enhance,
		form,
		errors,
		tainted,
		constraints,
		message,
		submitting,
		delayed,
		posted,
		...props
	} = superForm($page.data.contactForm, {
		id: 'contactForm',
		validators: contactFormSchema,
		clearOnSubmit: 'none',
		taintedMessage: null,
		onError: (errors) => {
			console.log('errors', errors);
		}
	});

	$: getValValidationClass = (
		key: keyof ContactFormSchema,
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
		notificationContext.removeNotification('contactFormMessage');
	}

	$: if ($message) {
		notificationContext.addNotification({
			id: 'contactFormMessage',
			variant: $message.type,
			priority: $message.type === 'red' ? true : false,
			html: $message.html,
			closeIcon: true
		});
	}

	$: console.log('posted', props);
</script>

<form
	use:enhance
	novalidate
	action="/contact"
	method="POST"
	class="grid custom-grid border-mauve-6 {c}"
	class:border-t={borderTop}
	class:border-b={borderBottom}
>
	<div class="flex flex-col">
		<div class="border-b border-mauve-6">
			<div class="h-12" />
		</div>
		<div class="border-b grow border-mauve-6 sm:hidden">
			<div class="" />
		</div>
		<div class="border-b border-mauve-6 sm:hidden">
			<div class="h-[377px] sm:h-0" />
		</div>
		<div class="sm:hidden"><div class="h-[58px]" /></div>
	</div>

	<div
		class="border-mauve-6 border-x bg-white/[.85] flex flex-col space-y-2 sm:flex-row sm:space-y-0 relative"
	>
		<div
			class="flex flex-col border-b border-mauve-6 space-y-2 sm:flex-1 sm:border-b-0"
		>
			<div class="flex border-b border-mauve-6">
				<h2 class="p-2 text-2xl">
					<slot name="headline">Kontakt</slot>
				</h2>
			</div>
			<p class="max-w-xs p-2 pt-0 sm:max-w-none lg:max-w-xs">
				<slot>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Facilis vero aut sint officia quos omnis corrupti iusto et
					at fugit soluta ad, earum cum commodi! Minus in deserunt
					maiores, corrupti, cumque tempora, assumenda iure tempore
					nobis officia voluptatem facilis optio aut eaque labore
					nesciunt voluptas quam ut asperiores ad enim
				</slot>
			</p>
		</div>
		<div class="hidden h-full border-r sm:block border-mauve-6" />
		<div class="relative flex flex-col space-y-2 sm:flex-1">
			<fieldset
				disabled={$submitting}
				class="flex flex-col border-b border-mauve-6 space-y-2 p-2
					pt-0 sm:pt-2"
			>
				<input
					type="hidden"
					hidden
					name="url"
					value={$page.url.toString()}
				/>

				<SuperformsInput
					id="name"
					name="name"
					label="Name*"
					{variant}
					formStore={form}
					errorsStore={errors}
					taintedStore={tainted}
					constraintsStore={constraints}
					type="text"
					autocomplete="name"
					enterkeyhint="send"
					placeholder="vielleicht David"
				/>

				<div
					class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
				>
					<label
						for="email"
						class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
							'email',
							{
								successClass:
									INPUT_COLOR_CLASSES.green.highlight,
								errorClass: INPUT_COLOR_CLASSES.red.highlight,
								defaultClass:
									INPUT_COLOR_CLASSES[variant].highlight
							}
						)}"
					>
						E-Mail*
					</label>
					<input
						id="email"
						class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
							'email',
							{
								successClass: 'to-green-5',
								errorClass: 'to-red-5'
							}
						)}"
						name="email"
						autocomplete="email"
						enterkeyhint="send"
						placeholder="email@example.com"
						type="email"
						bind:value={$form.email}
						data-invalid={$errors.email}
						{...$constraints.email}
					/>

					<p class="h-4 text-xs">
						{#if $errors.email}
							{$errors.email[0]}
						{/if}
					</p>
				</div>

				<div
					class="flex flex-col items-start max-w-xs group sm:max-w-none lg:max-w-xs"
				>
					<label
						for="message"
						class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
							'message',
							{
								successClass:
									INPUT_COLOR_CLASSES.green.highlight,
								errorClass: INPUT_COLOR_CLASSES.red.highlight,
								defaultClass:
									INPUT_COLOR_CLASSES[variant].highlight
							}
						)}"
					>
						Message*
					</label>
					<textarea
						rows="5"
						name="message"
						id="message"
						placeholder="Hi..."
						class="py-2 px-4 border-mauve-12 rounded-none resize-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
							'message',
							{
								successClass: 'to-green-5',
								errorClass: 'to-red-5'
							}
						)}"
						bind:value={$form.message}
						data-invalid={$errors.message}
						{...$constraints.message}
					/>

					<p class="h-4 text-xs">
						{#if $errors.message}
							{$errors.message[0]}
						{/if}
					</p>
				</div>
			</fieldset>
			<div class="flex flex-col p-2 pt-0">
				<Button
					name="submit"
					type="submit"
					form="rounded"
					{variant}
					filled
					class="flex flex-1 max-w-xs sm:max-w-none lg:max-w-xs"
					disabled={$submitting}
				>
					<span
						class="grow grid grid-cols-[minmax(0,_1fr)_auto_minmax(0,_1fr)] place-items-start"
					>
						{#if $delayed}
							<span class="px-1 -ml-2 bg-white rounded-full">
								🕸
							</span>
							<span class="col-start-2">Submitting...</span>
						{:else}
							<span class="px-1 -ml-2 bg-white rounded-full">
								💌
							</span>
							<span>Send</span>
						{/if}
					</span>
				</Button>
			</div>
			{#if $delayed}
				<div
					class="absolute inset-0 flex items-center justify-center cursor-wait bg-white/50 icon-mauve-12"
				>
					{#each getLoadingEmojis() as emoji}
						<p class="m-4 text-4xl animate-loading-1">
							{emoji}
						</p>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-col grid-cols-2">
		<div class="border-b border-mauve-6 sm:hidden">
			<div class="h-12 sm:h-0" />
		</div>
		<div class="border-b grow border-mauve-6" />
		<div class="border-b border-mauve-6 sm:hidden">
			<div class="h-[377px] sm:h-0" />
		</div>
		<div class="h-[58px]" />
	</div>
</form>

<style global>
	.custom-grid {
		--spacing-2: theme(spacing.2);
		grid-template-columns: var(--spacing-2) auto minmax(
				var(--spacing-2),
				1fr
			);
	}

	@media (min-width: 640px) {
		.custom-grid {
			grid-template-columns: var(--spacing-2) 1fr var(--spacing-2);
		}
	}

	@media (min-width: 768px) {
		.custom-grid {
			grid-template-columns: var(--spacing-2) 3fr 1fr;
		}
	}
</style>
